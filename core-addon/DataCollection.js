/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Glean from "@mozilla/glean/webext";
import PingEncryptionPlugin from "@mozilla/glean/webext/plugins/encryption";

import * as userMetrics from "../public/generated/user.js";
import * as rallyPings from "../public/generated/pings.js";

// The encryption key id and JWK to encrypt data that go
// to the "core" environment (i.e. `pioneer-core`). See
// bug 1677761 for additional details.
const CORE_ENCRYPTION_KEY_ID = "core";
const CORE_ENCRYPTION_JWK = {
  "crv": "P-256",
  "kid": "core",
  "kty": "EC",
  "x": "muvXFcGjbk2uZCCa8ycoH8hVxeDCGPQ9Ed2-QHlTtuc",
  "y": "xrLUev8_yUrSFAlabnHInvU4JKc6Ew3YXaaoDloQxw8",
};

export default class DataCollection {
  /**
   * Initializes the data collection engine.
   *
   * @param {boolean} userEnrolled
   *        Whether or not user has enrolled in the platform.
   */
  initialize(userEnrolled) {
    if (!__ENABLE_DATA_SUBMISSION__ || !__ENABLE_GLEAN__) {
      console.warn("DataCollection - Glean disabled by the build configuration.");
      return;
    }

    // Initialize Glean. Note that we always set 'uploadEnabled=true' if user
    // consented to join Rally. Upload is always enabled unless the web-extension
    // is uninstalled.
    Glean.initialize("rally-core", userEnrolled, {
        appDisplayVersion: browser.runtime.getManifest().version,
        plugins: [
          new PingEncryptionPlugin(CORE_ENCRYPTION_JWK)
        ]
      }
    );
  }

  /**
   * Sends an otherwise-empty ping with the deletion ID other provided info.
   *
   * @param {String} rallyId
   *        The id of the Rally platform.
   * @param {String} payloadType
   *        The type of the encrypted payload. This will define the
   *        `schemaName` of the ping.
   * @param {String} namespace
   *        The namespace to route the ping. This will define the
   *        `schemaNamespace` and `studyName` properties of the ping.
   * @param {String} deletionId
   *        It's sent in the ping, if present, to track deletion of user data without exposing the Rally ID.
   */
  async _sendPingWithDeletionId(rallyId, payloadType, namespace, deletionId) {
    let publicKey;
    let keyId;
    let payload = {};

    if (namespace === "pioneer-core") {
      // When routing pings to the "core" environment, we need to use
      // the proper encryption key.
      keyId = CORE_ENCRYPTION_KEY_ID;
      publicKey = CORE_ENCRYPTION_JWK;
      payload = { deletionId };
    } else {
      // When routing empty pings to the environments for the specific
      // studies, we can use a bogus key (the payload is empty).

      // NOTE - while we're not actually sending useful data in
      // this payload, the current Telemetry pipeline requires
      // that pings are shaped this way so they are routed to the correct
      // study environment.
      //
      // At the moment, the public key used here isn't important but we do
      // need to use *something*.
      keyId = "discarded";
      publicKey = {
        crv: "P-256",
        kty: "EC",
        x: "XLkI3NaY3-AF2nRMspC63BT1u0Y3moXYSfss7VuQ0mk",
        y: "SB0KnIW-pqk85OIEYZenoNkEyOOp5GeWQhS1KeRtEUE",
      };
    }

    await this.sendPing(
      rallyId,
      payloadType,
      payload,
      namespace,
      keyId,
      publicKey
    );
  }

  /**
   * Sends a Pioneer enrollment ping.
   *
   * The `creationDate` provided by the telemetry APIs will be used as the
   * timestamp for considering the user enrolled in pioneer and/or the study.
   *
   * @param {String} rallyId
   *        The id of the Rally platform.
   * @param {String} [schemaNamespace=undefined]
   *        optional schema namespace. It's sent in the ping, if present, to signal
   *        that user enroled in the study.
   * @param {String} deletionId
   *        It's sent in the ping, if present, to track deletion of user data without exposing the Rally ID.
   */
  async sendEnrollmentPing(rallyId, schemaNamespace, deletionId) {
    // If we were provided with a study id, then this is an enrollment to a study.
    // Send the id alongside with the data and change the schema namespace to simplify
    // the work on the ingestion pipeline.
    if (schemaNamespace !== undefined) {
      return await this._sendPingWithDeletionId(rallyId, "pioneer-enrollment", schemaNamespace);
    }

    // If this is a platform enrollment ping (not coming from the study), then the
    // `deletionId` should always be sent.
    if (deletionId === undefined) {
      throw new Error("DataCollection - the enrollment ping must have a deletion id");
    }

    // Note that the schema namespace directly informs how data is segregated after ingestion.
    // If this is an enrollment ping for the pioneer program (in contrast to the enrollment to
    // a specific study), use a meta namespace.
    return await this._sendPingWithDeletionId(rallyId, "pioneer-enrollment", "pioneer-core", deletionId);
  }

  /**
   * Sends a deletion-request ping.
   *
   * @param {String} rallyId
   *        The id of the Rally platform.
   * @param {String} schemaNamespace
   *        It's sent in the ping to signal that user unenrolled from a study.
   */
  async sendDeletionPing(rallyId, schemaNamespace) {
    if (schemaNamespace === undefined) {
      throw new Error("DataCollection - the deletion-request ping requires a schema namespace");
    }

    return await this._sendPingWithDeletionId(rallyId, "deletion-request", schemaNamespace);
  }

  /**
   * Send a ping using the Firefox legacy telemetry.
   *
   * @param {String} rallyId
   *        The id of the Rally platform.
   * @param {String} payloadType
   *        The type of the encrypted payload. This will define the
   *        `schemaName` of the ping.
   * @param {Object} payload
   *        A JSON-serializable payload to be sent with the ping.
   * @param {String} namespace
   *        The namespace to route the ping. This will define the
   *        `schemaNamespace` and `studyName` properties of the ping.
   * @param {String} keyId
   *        The id of the key used to encrypt the payload.
   * @param {Object} key
   *        The JSON Web Key (JWK) used to encrypt the payload.
   *        See the RFC 7517 https://tools.ietf.org/html/rfc7517
   *        for additional information. For example:
   *
   *        {
   *          "kty":"EC",
   *          "crv":"P-256",
   *          "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
   *          "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
   *          "kid":"Public key used in JWS spec Appendix A.3 example"
   *        }
   */
  async sendPing(rallyId, payloadType, payload, namespace, keyId, key) {
    if (!rallyId || typeof rallyId != "string") {
      throw new Error(`DataCollection.sendPing - invalid Rally id ${rallyId}`);
    }

    let options = {
      studyName: namespace,
      addPioneerId: true,
      overridePioneerId: rallyId,
      encryptionKeyId: keyId,
      publicKey: key,
      schemaName: payloadType,
      schemaVersion: 1,
      // Note that the schema namespace directly informs how data is
      // segregated after ingestion.
      schemaNamespace: namespace,
    };

    if (!__ENABLE_DATA_SUBMISSION__) {
      console.warn(`DataCollection.sendPing - data submission disabled, ping ${payloadType} not submitted with payload:`, payload);

      return;
    }

    // We intentionally don't wait on the promise returned by
    // `submitExternalPing`, because that's an internal API only meant
    // for telemetry tests. Moreover, in order to send a custom schema
    // name and a custom namespace, we need to ship a custom "experimental"
    // telemetry API for legacy telemetry.
    await browser.firefoxPrivilegedApi
      .submitEncryptedPing("pioneer-study", payload, options)
      .then(() => {
        console.debug(`DataCollection.sendPing - options: ${JSON.stringify(options)} payload: ${JSON.stringify(payload)}`);
      })
      .catch(error => {
        console.error(`DataCollection.sendPing failed - error: ${error}`);
      });
  }

  /**
   * Sends a demographic-survey ping with Glean.js.
   *
   * @param {Object} data
   *        A JSON-serializable object containing the demographics
   *        information submitted by the user..
   */
  sendDemographicsInGlean(data) {
    // The schema for the non-glean collection is hard to change.
    // In order for us to not change it, we transform the provided
    // fields in a way that's expected by Glean.

    if ("age" in data) {
      userMetrics.age[`band_${data["age"]}`].set(true);
    }

    if ("gender" in data) {
      userMetrics.gender[data["gender"]].set(true);
    }

    if ("hispanicLatinxSpanishOrigin" in data) {
      const label = (data["hispanicLatinxSpanishOrigin"] === "other")
        ? "other" : "hispanicLatinxSpanish";
      userMetrics.origin[label].set(true);
    }

    if ("race" in data) {
      for (const raceLabel of data["race"]) {
        const label = (raceLabel === "american_indian_or_alaska_native")
          ? "am_indian_or_alaska_native" : raceLabel;
        userMetrics.races[label].set(true);
      }
    }

    if ("school" in data) {
      const KEY_FIXUP = {
        "high_school_graduate_or_equivalent": "high_school_grad_or_eq",
        "some_college_but_no_degree_or_in_progress": "college_degree_in_progress",
      };

      const originalLabel = data["school"];
      const label = (originalLabel in KEY_FIXUP)
        ? KEY_FIXUP[originalLabel] : originalLabel;
      userMetrics.school[label].set(true);
    }

    if ("income" in data) {
      userMetrics.income[`band_${data["income"]}`].set(true);
    }

    if ("zipcode" in data) {
      userMetrics.zipcode.set(data["zipcode"]);
    }

    rallyPings.demographics.submit();
  }

  /**
   * Sends a demographic-survey ping.
   *
   * @param {String} rallyId
   *        The id of the Rally platform.
   * @param {Object} data
   *        A JSON-serializable object containing the demographics
   *        information submitted by the user..
   */
  async sendDemographicSurveyPing(rallyId, data) {
    // Once Rally fully migrates to Glean.js, the whole content of
    // `sendDemographicSurveyPing` should be replaced by `sendDemographicsInGlean`.
    this.sendDemographicsInGlean(data);

    const FIELD_MAPPING = {
      "age": "age",
      "gender": "gender",
      "hispanicLatinxSpanishOrigin": "origin",
      "school": "education",
      "income": "income",
    };

    // Important: the following code flattens out arrays and nested
    // structures (for example, "race": ["a", "b"] becomes in the
    // payload "races": {"a": true, "b": true}). We do this for two
    // reasons:
    //
    // - Analysts won't have to do string checks (e.g. "races".contain("samoan"))
    //   which is error prone, given that any term could be mispelled and
    //   contain typos. With this approach data points will have their own
    //   column (e.g. "races_samoan") and the stored boolean value indicates
    //   whether or not that race was reported.
    // - This future-proofs data by rationalizing it in terms of how
    //   Glean wants it.

    let processed = {};

    // Map all the fields but "race" (because that has multiple
    // possible values).
    for (const [originalField, newName] of Object.entries(FIELD_MAPPING)) {
      if (originalField in data) {
        processed[newName] = { [data[originalField]]: true };
      }
    }

    // Note: "race" gets renamed to "races" and has multiple
    // values.
    if ("race" in data) {
      processed["races"] = data.race.reduce((a, b) => ((a[b] = true), a), {});
    }

    // Note: "zipcode" gets renamed to "zipCode" and directly
    // assigned a value.
    if ("zipcode" in data) {
      processed["zipCode"] = data["zipcode"];
    }

    return await this.sendPing(
      rallyId,
      "demographic-survey",
      processed,
      "pioneer-core",
      CORE_ENCRYPTION_KEY_ID,
      CORE_ENCRYPTION_JWK,
    );
  }
}
