/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = class Storage {
  async setIonID(uuid) {
    return await browser.storage.local.set({ionId: uuid});
  }

  async clearIonID() {
    return await browser.storage.local.remove("ionId");
  }

  /**
   * Get the list of study ids user took part to.
   *
   * @returns {Promise} resolved with the list of activated studies
   *          if the study is added to the list, rejected on errors.
   */
  async getActivatedStudies() {
    // Attempt to retrieve any previously stored study ids.
    return await browser.storage.local.get("activatedStudies").then(
        stored => {
          // This branch will be hit even if `activatedStudies` was never
          // stored (e.g. this is the first save). Make sure to account for
          // that case by returning an empty array.
          return stored.activatedStudies || [];
        },
        error => {
          console.error("Storage - failed to read from the local storage", error);
          return [];
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

  async clearActivatedStudies() {
    return await browser.storage.local.remove("activatedStudies");
  }
};
