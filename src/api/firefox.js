/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export default {
  // initialize the frontend's store from firefox's internal storage.
  async initialize(key) {},

  // fetch available studies from remote location.
  // use in store instantiation. This assumes that the studies are
  // stored somewhere (i.e. remote settings)
  async getAvailableStudies() {},

  // fetch ion enrollment from remote location, if available.
  // use in the store instantiation.
  async getIonEnrollment() {},

  // return the app state from firefox's internal storage.
  // this is called on store instantiation.
  async getItem(key) {},

  // save the app state in firefox's internal storage.
  // this fires every time store.produce is called.
  async setItem(key, value) {},

  // updates the study enrollment in the firefox's internal storage, if needed.
  async updateStudyEnrollment(studyID, enroll) {},

  // updates the overall Ion enrollment in firefox's internal storage, if needed.
  async updateIonEnrollment(studyID, enroll) {},
};
