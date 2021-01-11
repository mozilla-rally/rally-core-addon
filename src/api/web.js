/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import availableStudies from "../mocks/available-studies";

// return Promises to make API compatible with async implementations
export default {
  async initialize(key) {
    // returns the last saved app state.
    if (localStorage.getItem(key) === null) {
      return undefined;
    }
    return this.getItem(key);
  },
  async getAvailableStudies() {
    // this API function will return the available studies from a remote source.
    // use it when instantiating or updating the app store.
    return Promise.resolve(availableStudies);
  },
  async getPlatformEnrollment() {
    // this API function will return platform enrollment status from a remote source.
    // use it primarily when instantiating or updating the app store.
    const state = await this.getItem("__STATE__");
    if (state !== null) {
      return JSON.parse(state).isEnrolled || false;
    } else {
      return false;
    }
  },
  async getItem(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  async setItem(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },
  async updateStudyEnrollment(studyID, enroll) {
    // this updates the study enrollment in whatever remote location
    // we might need to keep track of that.
    return true;
  },
  async updatePlatformEnrollment(enroll) {
    // this updates the platform enrollment in whatever remote location we have.
    return true;
  },
};
