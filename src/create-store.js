import { writable } from "svelte/store";
import { produce } from "immer/dist/immer.cjs.production.min.js";

const STORE_KEY = "__STATE__";
export default function createStore(initialState, api) {
  // initialize the writable store.
  const { subscribe, update, set } = writable();

  // initialize from the API.
  api.initialize(STORE_KEY, initialState).then(async (remoteInitialState) => {
    const state = remoteInitialState || initialState;
    state.availableStudies = await api.getAvailableStudies();
    set(state);
  });

  return {
    subscribe,
    set,
    produce(fcn) {
      update((draft) => {
        const nextState = produce(draft, fcn);
        api.setItem(STORE_KEY, nextState);
        return nextState;
      });
    },
    setField(key, value) {
      this.produce((state) => {
        state[key] = value;
      });
    },
    async updateStudyEnrollment(studyID, enroll = undefined) {
      let outcome;
      // send study enrollment message
      try {
        outcome = await api.updateStudyEnrollment(studyID, enroll);
      } catch (err) {
        console.error(err);
      }
      // if study enrollment is successful, update frontend.
      if (outcome) {
        this.produce((draft) => {
          if (draft.activeStudies.includes(studyID)) {
            draft.activeStudies = draft.activeStudies.filter(
              (id) => id !== studyID
            );
          } else {
            draft.activeStudies.push(studyID);
          }
        });
      }
    },
    async updateIonEnrollment(enroll = undefined) {
      let outcome;
      // send the ion enrollment message
      try {
        outcome = await api.updateIonEnrollment(enroll);
      } catch (err) {
        console.log(err);
      }
      // if ion enrollment is successful, update frontend.
      if (outcome) {
        this.produce((draft) => {
          draft.enrolled = enroll === undefined ? !draft.enrolled : enroll;
        });
      }
    },
  };
}
