/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { writable } from "svelte/store";
import api from "./web-extension-api";

export default function createStore() {
  // initialize the writable store.
  const { subscribe, set } = writable();

  // initialize from the API.
  api.initialize().then(async (newState) => {
    console.log(`initialize: updated state -`, newState);
    set(newState);
  });

  // set UI when the background script reports a new state.
  api.onNextState(set);

  return {
    subscribe,
    set,
    async updateStudyEnrollment(studyID, enroll) {
      // Enforce the truthyness of `enroll`, to make sure
      // it's always a boolean.
      let coercedEnroll = !!enroll;
      console.debug(
        `Rally - changing study ${studyID} enrollment to ${coercedEnroll}`);

      // send study enrollment message
      try {
        await api.updateStudyEnrollment(studyID, coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
    async updatePlatformEnrollment(enroll) {
      // Enforce the truthyness of `enroll`, to make sure
      // it's always a boolean.
      let coercedEnroll = !!enroll;
      console.debug(`Rally - changing enrollment to ${coercedEnroll}`);

      // send the ion enrollment message
      try {
        await api.updatePlatformEnrollment(coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
    async updateDemographicSurvey(data) {
      try {
        await api.updateDemographicSurvey(data);
      } catch (err) {
        console.error(`Rally - failed to update the demographic survey`, err);
      }
    }
  };
}
