/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = class DataCollection {
  /**
   * Sends an empty Ion ping with the provided info.
   *
   * @param {String} payloadType
   *        The type of the encrypted payload. This will define the
   *        `schemaName` of the ping.
   *
   * @param {String} namespace
   *        The namespace to route the ping. This will define the
   *        `schemaNamespace` and `studyName` properties of the ping.
   */
  async _sendEmptyPing(payloadType, namespace) {
    // NOTE - while we're not actually sending useful data in
    // this payload, the current Ion v2 Telemetry pipeline requires
    // that pings are shaped this way so they are routed to the correct
    // environment.
    //
    // At the moment, the public key used here isn't important but we do
    // need to use *something*.
    const publicKey = {
      crv: "P-256",
      kty: "EC",
      x: "XLkI3NaY3-AF2nRMspC63BT1u0Y3moXYSfss7VuQ0mk",
      y: "SB0KnIW-pqk85OIEYZenoNkEyOOp5GeWQhS1KeRtEUE",
    };

    await this.sendPing(
      payloadType,
      // We expect to send an empty payload.
      {},
      namespace,
      "discarded",
      publicKey
    );
  }

  /**
   * Sends a Pioneer enrollment ping.
   *
   * The `creationDate` provided by the telemetry APIs will be used as the
   * timestamp for considering the user enrolled in pioneer and/or the study.
   *
   * @param {String} [studyAddonid=undefined]
   *        optional study id. It's sent in the ping, if present, to signal
   *        that user enroled in the study.
   */
  async sendEnrollmentPing(studyAddonId) {
    // If we were provided with a study id, then this is an enrollment to a study.
    // Send the id alongside with the data and change the schema namespace to simplify
    // the work on the ingestion pipeline.
    if (studyAddonId !== undefined) {
      return await this._sendEmptyPing("pioneer-enrollment", studyAddonId);
    }

    // Note that the schema namespace directly informs how data is segregated after ingestion.
    // If this is an enrollment ping for the pioneer program (in contrast to the enrollment to
    // a specific study), use a meta namespace.
    return await this._sendEmptyPing("pioneer-enrollment", "pioneer-meta");
  }

  /**
   * Sends a Ion deletion-request ping.
   *
   * @param {String} studyAddonid
   *        It's sent in the ping to signal that user unenrolled from a study.
   */
  async sendDeletionPing(studyAddonId) {
    if (studyAddonId === undefined) {
      throw new Error("IonCore - the deletion-request ping requires a study id");
    }

    return await this._sendEmptyPing("deletion-request", studyAddonId);
  }

  /**
   * Send a ping using the Firefox legacy telemetry.
   *
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
  async sendPing(payloadType, payload, namespace, keyId, key) {
    let options = {
      studyName: namespace,
      addPioneerId: true,
      encryptionKeyId: keyId,
      publicKey: key,
      schemaName: payloadType,
      schemaVersion: 1,
      // Note that the schema namespace directly informs how data is
      // segregated after ingestion.
      schemaNamespace: namespace,
    };

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
};
