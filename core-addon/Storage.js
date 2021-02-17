/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = class Storage {
  constructor() {
    // We don't want a persistent storage for pending consent,
    // we must clear it across browser restarts and whenever the
    // core add-on is deactivated.
    this.pendingConsents = [];
  }

  /**
   * Gets the stored value from the local browser storage.
   *
   * @param {String} key
   *        The name of the key to retrieve data from.
   */
  async getItem(key) {
    try {
      return (await browser.storage.local.get(key))[key];
    } catch (err) {
      console.error(`Storage - failed to read ${key} from the local storage`, err);
      return Promise.resolve();
    }
  }

  /**
   * Store a value in the local browser storage.
   *
   * @param {String} key
   *        The name of the key to store data into.
   * @param {<Primitive Type> or Array} value
   *        The value to store. It can be any of the primitive
   *        types (e.g. numbers, booleans) or Array types. See
   *        the documentation for additional information:
   *        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
   */
  async setItem(key, value) {
    return browser.storage.local.set({ [key]: value });
  }

  async getRallyID() {
    return await this.getItem("rallyId");
  }

  async setRallyID(uuid) {
    return await this.setItem("rallyId", uuid);
  }

  async clearRallyID() {
    return await browser.storage.local.remove("rallyId");
  }

  /**
   * Get the provided demographic data.
   *
   * @returns {Promise} resolved with the list of demographic answers
   *          already provided by the user.
   */
  async getDemographicsData() {
    return await this.getItem("demographicsData");
  }

  /**
   * Set the provided demographic data.
   *
   * @returns {Promise} 
   */
  async setDemographicsData(data) {
    return await this.setItem("demographicsData", data);
  }

    /**
   * Get the provided demographic data.
   *
   * @returns {Promise} resolved with a boolean denoting
   *          if the user finished the first run of the 
   *          Core Add-On.
   */
  async getFirstRunCompletion() {
    return await this.getItem("firstRunCompleted");
  }

  /**
   * Set the provided demographic data.
   *
   * @returns {Promise} 
   */
  async setFirstRunCompletion(firstRun) {
    return await this.setItem("firstRunCompleted", firstRun);
  }

  /**
   * Get the list of study ids user took part to.
   *
   * @returns {Promise} resolved with the list of activated studies
   *          if the study is added to the list, rejected on errors.
   */
  async getActivatedStudies() {
    // Attempt to retrieve any previously stored study ids.
    return await this.getItem("activatedStudies").then(
        stored => {
          // This branch will be hit even if `activatedStudies` was never
          // stored (e.g. this is the first save). Make sure to account for
          // that case by returning an empty array.
          return stored || [];
        }
      );
  }

  /**
   * Adds a study id to the stored list of activated studies.
   *
   * @param {String} studyId
   *        The id of the study to add to the list. If the id
   *        is already present, this function is a no-op.
   * @returns {Promise} resolved with the list of activated studies
   *          if the study is added to the list, rejected on errors.
   */
  async appendActivatedStudy(studyId) {
    // Attempt to retrieve any previously stored study ids.
    let storedIds = await this.getActivatedStudies();

    // If the study id is already present bail out.
    if (storedIds.includes(studyId)) {
      return storedIds;
    }

    storedIds.push(studyId);

    // Store the updated list.
    await browser.storage.local.set({activatedStudies: storedIds});

    return storedIds;
  }

  async removeActivatedStudy(studyId) {
    let storedIds = await this.getActivatedStudies();
    if (!storedIds.includes(studyId)) {
      return storedIds;
    }

    storedIds = storedIds.filter(s => s !== studyId);

    // Store the updated list.
    await browser.storage.local.set({activatedStudies: storedIds});

    return storedIds;
  }

  async clearActivatedStudies() {
    return await browser.storage.local.remove("activatedStudies");
  }

  /**
   * Record that user consented to join a study, but
   * the study was not installed yet.
   *
   * @param {String} the study id.
   */
  addPendingConsent(studyId) {
    if (!this.pendingConsents.includes(studyId)) {
      this.pendingConsents.push(studyId);
    }
  }

  /**
   * Remove the given study from the pending consent state.
   *
   * @returns {Boolean} whether or not the study was in the
   *          "pending consent" state.
   */
  removePendingConsent(studyId) {
    if (!this.pendingConsents.includes(studyId)) {
      return false;
    }

    this.pendingConsents = this.pendingConsents.filter(s => s !== studyId);

    return true;
  }
};
