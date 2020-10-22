import { writable } from "svelte/store";

export default function createStore(initialState, api) {
  // initialize the writable store.
  const { subscribe, update, set } = writable();

  // initialize from the API.
  api.initialize(initialState).then(async (remoteInitialState) => {
    console.log('initialize', remoteInitialState, initialState);
    const state = remoteInitialState || initialState;
    state.availableStudies = await api.getAvailableStudies();
    set(state);
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
        `Ion - changing study ${studyID} enrollment to ${coercedEnroll}`);

      // send study enrollment message
      try {
        await api.updateStudyEnrollment(studyID, coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
    async updateIonEnrollment(enroll) {
      // Enforce the truthyness of `enroll`, to make sure
      // it's always a boolean.
      let coercedEnroll = !!enroll;
      console.debug(`Ion - changing enrollment to ${coercedEnroll}`);

      // send the ion enrollment message
      try {
        await api.updateIonEnrollment(coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
  };
}
