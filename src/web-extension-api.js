/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import browser from "webextension-polyfill";

/**
 * Utility function to build a message to the web-extension.
 *
 * @param {runtime.Port} port
 *        The connection port to communicate with the background
 *        script.
 * @param {String} type
 *        The type of the message being sent. Unknown types
 *        will be rejected by the Core Add-on. See the
 *        `VALID_TYPES` in the implementation for a list of
 *        valid values.
 * @param {Object} payload
 *        A JSON-serializable object representing the payload
 *        of the message to be passed to the Core addon.
 */
async function sendToCore(port, type, payload) {
  const VALID_TYPES = [
    "enrollment",
    "get-studies",
    "study-enrollment",
    "study-unenrollment",
    "unenrollment",
    "update-demographics",
    "uninstall-rally"
  ];

  // Make sure `type` is one of the expected values.
  if (!VALID_TYPES.includes(type)) {
    return Promise.reject(
      new Error(`Rally: sendToCore - unexpected message to core "${type}"`));
  }

  const msg = {
    type,
    data: payload
  };

  port.postMessage(msg);
}

/**
 * Wait for a message coming on a port.
 *
 * @param {runtime.Port} port
 *        The communication port to expect the message on.
 * @param {String} type
 *        The name of the message to wait for.
 * @returns {Promise} resolved with the content of the response
 *          when the message arrives.
 */
async function waitForCoreResponse(port, type) {
  return await new Promise(resolve => {
    let handler = msg => {
      if (msg.type === type) {
        port.onMessage.removeListener(handler);
        resolve(msg.data);
      }
    };
    port.onMessage.addListener(handler);
  });
}

/**
 * This API implementation depends on sending messages back to
 * a web extension to store the overall app state whenever it
 * changes.
 */
export default {
  // The connection end used to communicate with the background script
  // of this addon. See the MDN documentation for more info:
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port
  _connectionPort: null,

  // initialize the frontend's store from the add-on local storage.
  async initialize() {
    // _stateChangeCallbacks holds all the callbacks we want to execute
    // once the background sends a message with a new state.
    this._stateChangeCallbacks = [];

    // initialize the connection port.
    this._connectionPort =
      browser.runtime.connect({name: "ion-options-page"});

    this._connectionPort.onMessage.addListener(
      m => this._handleMessage(m));

    // The onDisconnect event is fired if there's no receiving
    // end or in case of any other error. Log an error and clear
    // the port in that case.
    this._connectionPort.onDisconnect.addListener(e => {
      console.error("Rally - there was an error connecting to the background script", e);
      this._connectionPort = null;
    });

    // Ask explicitly for the current state.
    return this.getAvailableStudies();
  },

  // fetch available studies from remote location.
  // use in store instantiation. This assumes that the studies are
  // stored somewhere (i.e. remote settings)
  async getAvailableStudies() {
    let response =
      waitForCoreResponse(this._connectionPort, "update-state");

    await sendToCore(this._connectionPort, "get-studies", {});
    return await response;
  },

  // return the app state from the add-on.
  // this is called on store instantiation.
  async getItem() {
    try {
      // TODO can this be removed?
      return await browser.storage.local.get();
    } catch (err) {
      console.error(err);
    }
  },

  // save the app state in the add-on.
  // this fires every time store.produce is called.
  async setItem(key, value) {
    return browser.storage.local.set({ [key]: value });
  },

  /**
   * Updates the study enrollment.
   *
   * @param {Boolean} enroll
   *        `true` if user decided to enroll in a Study,
   *        `false` if user opted out.
   * @returns {Boolean} `true` if the enrollment status was successfully
   *          updated, `false` otherwise.
   */

  async updateStudyEnrollment(studyID, enroll) {
    if (!enroll) {
      // Trigger addon uninstallation.
      return await sendToCore(
        this._connectionPort, "study-unenrollment", { studyID }
      ).then(r => true);
    }

    // Fetch the study add-on and attempt to install it.
    const state = await this.getAvailableStudies();
    const studies = state.availableStudies;
    const studyMetadata = studies.find(s => s.addon_id === studyID);

    // This triggers the install by directing the page toward the sourceURI,
    // which is the study add-on's xpi.
    window.location.href = studyMetadata.sourceURI.spec;

    return true;
  },

  /**
   * Updates the platform enrollment in the add-on.
   *
   * @param {Boolean} enroll
   *        `true` if user decided to enroll in the platform,
   *        `false` otherwise.
   * @returns {Boolean} `true` if the enrollment status was successfully
   *          updated, `false` otherwise.
   */
  async updatePlatformEnrollment(enroll) {
    await sendToCore(
      this._connectionPort, enroll ? "enrollment" : "unenrollment", {});

    return true;
  },

    /**
   * Removes the Rally add-on if requested by the user.
   * Note: unenrolling from Rally via updatePlatformEnrollment
   * also removes the add-on. This API method is for cases where
   * the user is requesting the add-on to be explicitly uninstalled,
   * eg if they are non-US and get the welcome splash page that
   * enables them to remove the extension.
   * @returns {Boolean} `true` if add-on will uninstall itself.
   */
  async uninstallRally(enroll) {
    await sendToCore(
      this._connectionPort, "uninstall-rally");

    return true;
  },

  /**
   * Updates the stored version of the demographics data.
   *
   * @param {Object} data
   *        A JSON-serializable object containing the demographics
   *        information submitted by the user.
   */
  async updateDemographicSurvey(data) {
    await sendToCore(this._connectionPort, "update-demographics", data);
  },

  /**
   * Handle messages coming from the background script.
   *
   * @param {Object} message
   *        The incoming message, with the following structure:
   * ```js
   * {
   *  type: "message-type",
   *  data: { ... },
   * }
   * ```
   */
  async _handleMessage(message) {
    switch (message.type) {
      case "update-state": {
        // update the UI.
        this._stateChangeCallbacks.forEach(callback => callback(message.data));
      } break;
      default:
        return Promise.reject(
          new Error(`Rally - unexpected message type ${message.type}`));
    }
  },

  /**
   * Handle state updates from the background script.
   *
   * @param {Function} callback
   *        A function that has the new state as an argument.
   */
  onNextState(callback) {
    this._stateChangeCallbacks.push(callback);
  }
};
