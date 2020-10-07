/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Utility function to build a message to the web-extension.
 *
 * @param {String} type
 *        The type of the message being sent. Unknown types
 *        will be rejected by the Core Add-on. Valid values
 *        are: `enrollment` (to enroll in Ion).
 * @param {Object} payload
 *        A JSON-serializable object representing the payload
 *        of the message to be passed to the Core addon.
 */
async function sendToCore(type, payload) {
  const VALID_TYPES = [
    "enrollment",
  ];

  // Make sure `type` is one of the expected values.
  if (!VALID_TYPES.includes(type)) {
    console.error(`Ion: sendToCore - unexpected message to core "${type}"`);
    return Promise.reject();
  }

  const msg = {
    type,
    data: payload
  };

  return await browser.runtime.sendMessage(msg);
}

/**
 * This API implementation depends on sending messages back to
 * a web extension to store the overall app state whenever it
 * changes.
 */
export default {
  // initialize the frontend's store from the add-on local storage.
  async initialize(key) {
    // get from
    // returns the last saved app state.
    return this.getItem(key);
  },

  // fetch available studies from remote location.
  // use in store instantiation. This assumes that the studies are
  // stored somewhere (i.e. remote settings)
  async getAvailableStudies() {
    try {
      const request = await fetch(
        "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records"
      );
      return (await request.json()).data;
    } catch (err) {
      console.error(err);
    }
  },

  // fetch ion enrollment from remote location, if available.
  // use in the store instantiation.
  async getIonEnrollment() {
    // this API function will return Ion enrollment status from a remote source.
    // use it primarily when instantiating or updating the app store.
    const state = await this.getItem("__STATE__");
    state.isEnrolled || false;
  },

  // return the app state from the add-on.
  // this is called on store instantiation.
  async getItem(key) {
    try {
      return (await browser.storage.local.get(key))[key];
    } catch (err) {
      console.error(err);
    }
  },

  // save the app state in the add-on.
  // this fires every time store.produce is called.
  async setItem(key, value) {
    return browser.storage.local.set({ [key]: value });
  },

  // updates the study enrollment in the add-on, if needed.
  // NOTE: if updating in the app store in the add-on suffices,
  // this should probably just return the OK signal.
  async updateStudyEnrollment(studyID, enroll) {
    return true;
  },

  /**
   * Updates the overall Ion enrollment in the add-on.
   * NOTE: if updating in the app store in the add-on suffices,
   * this should probably just return the OK signal.
   *
   * @param {Boolean} enroll
   *        `true` if user decided to enroll in the Ion platform,
   *        `false` otherwise.
   * TODO: Why can `enroll` be undefined?
   */
  async updateIonEnrollment(enroll) {
    let coercedEnroll = !!enroll;
    return await sendToCore("enrollment", {});
  },
};
