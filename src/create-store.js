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
    updateStudyEnrollment(studyID, enroll = undefined) {
      api
        .updateStudyEnrollment(studyID, enroll)
        .then((outcome) => {
          // when request lands, update study enrollment in the frontend store.
          this.produce((draft) => {
            if (draft.activeStudies.includes(studyID)) {
              draft.activeStudies = draft.activeStudies.filter(
                (id) => id !== studyID
              );
            } else {
              draft.activeStudies.push(studyID);
            }
          });
        })
        .catch((err) => {
          // FIXME: do something here.
        });
    },
    updateIonEnrollment(enroll = undefined) {
      api
        .updateIonEnrollment(enroll)
        .then((outcome) => {
          // when the request lands, update study enrollment in the frontend store.
          this.produce((draft) => {
            draft.enrolled = enroll === undefined ? !draft.enrolled : enroll;
          });
        })
        .catch((err) => {
          // FIXME: do something here.
        });
    },
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
  };
}
