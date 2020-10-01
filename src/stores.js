import { writable } from "svelte/store";
import { produce } from "immer/dist/immer.cjs.production.min.js";

import api from "./api/__API_ENDPOINT__";
const initialValue = __STORE_IMPLEMENTATION__;

const STORE_KEY = "__STATE__";

const webChannelId = "pioneer";

export const dispatchFxEvent = (message) => {
  window.dispatchEvent(
    new window.CustomEvent("WebChannelMessageToChrome", {
      detail: JSON.stringify({
        id: webChannelId,
        message: message,
      }),
    })
  );
};

function createStore(initialState) {
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

export const store = createStore(initialValue);
// export const firefox = readable(initialValue, async (set) => {
//   window.addEventListener("WebChannelMessageToContent", handleEvent);
//   dispatchFxEvent({ enrolled: true });

//   let enrolled;
//   let activeStudies;
//   let availableStudies;

//   function handleEvent(e) {
//     console.debug(e.detail.message);
//     const key = Object.keys(e.detail.message.data)[0];
//     const value = e.detail.message.data[key];

//     switch (key) {
//       case "activeStudies":
//         activeStudies = value;

//         const result = {
//           enrolled: enrolled,
//           activeStudies: activeStudies,
//           availableStudies: availableStudies,
//         };
//         set(result);
//         return;

//         break;
//       case "availableStudies":
//         availableStudies = value;
//         dispatchFxEvent({ activeStudies: true });
//         break;
//       case "enrolled":
//         enrolled = value;
//         dispatchFxEvent({ availableStudies: true });
//         break;
//       case "enroll":
//         if (value === true) {
//           dispatchFxEvent({ enrolled: true });
//         }
//         break;
//       case "unenroll":
//         if (value === true) {
//           dispatchFxEvent({ enrolled: true });
//         }
//         break;
//       case "installStudy":
//         dispatchFxEvent({ activeStudies: true });
//         break;
//       case "uninstallStudy":
//         dispatchFxEvent({ activeStudies: true });
//         break;
//       default:
//         break;
//     }
//   }
// });
