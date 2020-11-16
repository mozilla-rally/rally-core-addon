/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const CORE_ADDON_ID = "ion-core-addon@mozilla.org";
const ION_SIGNUP_URL = "https://mozilla-ion.github.io/ion-core-addon/";

module.exports = class Ion {
  /**
   * Initialize the Ion library.
   *
   * @param {String} keyId
   *        The id of the key used to encrypt outgoing data.
   * @param {Object} key
   *        The JSON Web Key (JWK) used to encrypt the outgoing data.
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
  async initialize(keyId, key) {
    console.debug("Ion.initialize");

    this._validateEncryptionKey(keyId, key);

    this._keyId = keyId;
    this._key = key;

    await this._checkIonCore().then(
        () => console.debug("Ion.initialize - Found Ion Core")
      ).catch(
        async () => await browser.tabs.create({ url: ION_SIGNUP_URL })
      );

    // Listen for incoming messages from the Core addon.
    browser.runtime.onMessageExternal.addListener(
      (m, s) => this._handleExternalMessage(m, s));

    // We went through the whole init process, it's now safe
    // to use the Ion public APIs.
    this._initialized = true;
  }

  /**
   * Check if the Core addon is installed.
   *
   * @returns {Promise} resolved if the core addon was found and
   *          communication was successful, rejected otherwise.
   */
  async _checkIonCore() {
    try {
      return await browser.management.get(CORE_ADDON_ID);
    } catch (ex) {
      console.error("Ion._checkIonCore - core addon not found", ex);
      return Promise.reject(ex);
    }

    // TODO: in addition to checking if the addon is installed,
    // this should check if user has joined the platform by sending
    // a message to the addon and waiting for its response.
  }

  /**
   * Handles messages coming in from external addons.
   *
   * @param {Object} message
   *        The payload of the message.
   * @param {runtime.MessageSender} sender
   *        An object containing informations about who sent
   *        the message.
   * @returns {Promise} The response to the received message.
   *          It can be resolved with a value that is sent to the
   *          `sender`.
   */
  _handleExternalMessage(message, sender) {
    // We only expect messages coming from the core addon.
    if (sender.id != CORE_ADDON_ID) {
      return Promise.reject(
        new Error(`Ion._handleExternalMessage - unexpected sender ${sender.id}`));
    }

    switch (message.type) {
      case "uninstall":
        return browser.management.uninstallSelf({showConfirmDialog: false});
      default:
        return Promise.reject(
          new Error(`Ion._handleExternalMessage - unexpected message type ${message.type}`));
    }
  }

  /**
   * Validate the provided encryption keys.
   *
   * @param {String} keyId
   *        The id of the key used to encrypt outgoing data.
   * @param {Object} key
   *        The JSON Web Key (JWK) used to encrypt the outgoing data.
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
   *
   * @throws {Error} if either the key id or the JWK key object are
   *         invalid.
   */
  _validateEncryptionKey(keyId, key) {
    if (typeof keyId !== "string") {
      throw new Error(`Ion._validateEncryptionKey - Invalid encryption key id ${keyId}`);
    }

    if (typeof key !== "object") {
      throw new Error(`Ion._validateEncryptionKey - Invalid encryption key ${key}`);
    }
  }

  /**
   * Submit an encrypted ping through the Ion Core addon.
   *
   * @param {String} payloadType
   *        The type of the encrypted payload. This will define the
   *        `schemaName` of the ping.
   * @param {Object} payload
   *        A JSON-serializable payload to be sent with the ping.
   */
  async sendPing(payloadType, payload) {
    if (!this._initialized) {
      console.error("Ion.sendPing - Not initialzed, call `initialize()`");
      return;
    }

    // Wrap everything in a try block, as we don't really want
    // data collection to be the culprit of a bug hindering user
    // experience.
    try {
      // The unique identifier of the study can be used as the
      // namespace, in order to make sure data is routed to the
      // proper analysis sandbox.
      const studyName = browser.runtime.id;

      // This function may be mistakenly called while init has not
      // finished. Let's be safe and check for key validity again.
      this._validateEncryptionKey(this._keyId, this._key);

      const msg = {
        type: "telemetry-ping",
        data: {
          payloadType: payloadType,
          payload: payload,
          namespace: studyName,
          keyId: this._keyId,
          key: this._key
        }
      }
      await browser.runtime.sendMessage(CORE_ADDON_ID, msg, {});
    } catch (ex) {
      console.error(`Ion.sendPing - error while sending ${payloadType}`, ex);
    }
  }
}
