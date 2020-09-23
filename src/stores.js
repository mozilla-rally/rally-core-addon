import { readable } from "svelte/store";

const webChannelId = "pioneer";

export const firefox = readable({}, (set) => {
  console.debug("1");
  const res = new Promise(function (resolve, reject) {
    console.debug("2");
    window.addEventListener("WebChannelMessageToContent", handleEvent);
    dispatchFxEvent({ enrolled: true });

    let enrolled;
    let activeStudies;
    let availableStudies;

    function handleEvent(e) {
      const key = Object.keys(e.detail.message.data)[0];
      const value = e.detail.message.data[key];

      console.debug(key, value);

      switch (key) {
        case "activeStudies":
          activeStudies = value;
          resolve({
            enrolled: enrolled,
            activeStudies: activeStudies,
            availableStudies: availableStudies,
          });
          break;
        case "availableStudies":
          availableStudies = value;
          dispatchFxEvent({ activeStudies: true });
          break;
        case "enrolled":
          if (value === true) {
            enrolled = value;
          }
          dispatchFxEvent({ availableStudies: true });
          break;
        case "enroll":
          if (value === true) {
            dispatchFxEvent({ enrolled: true });
          }
          break;
        case "unenroll":
          if (value === true) {
            dispatchFxEvent({ enrolled: true });
          }
          break;
        case "installStudy":
          dispatchFxEvent({ activeStudies: true });
          break;
        case "uninstallStudy":
          dispatchFxEvent({ activeStudies: true });
          break;
        default:
          break;
      }
    }
  });

  res.then((result) => {
    console.debug("res", result);
    set(result);
  });
  //return () => {};
});

function dispatchFxEvent(message) {
  window.dispatchEvent(
    new window.CustomEvent("WebChannelMessageToChrome", {
      detail: JSON.stringify({
        id: webChannelId,
        message: message,
      }),
    })
  );
}
