import { readable } from "svelte/store";

export const firefoxIon = readable(undefined, function start(set) {
  window.addEventListener("WebChannelMessageToContent", handleEvent);
  dispathFxEvent("enrolled");
  return function stop() {
    window.removeEventListener("WebChannelMessageToContent", handleEvent);
  };
});

function dispathFxEvent(message) {
  window.dispatchEvent(
    new window.CustomEvent("WebChannelMessageToChrome", {
      detail: JSON.stringify({
        id: "pioneer",
        message: message,
      }),
    })
  );
}

function handleEvent(e) {
  const key = Object.keys(e.detail.message.data)[0];
  const value = e.detail.message.data[key];

  let joinButton;
  let studyAddonId;

  switch (key) {
    case "activeStudies":
      activeStudies = value;
      break;
    case "availableStudies":
      availableStudies = value;
      break;
    case "enrolled":
      enrolled = value;
      dispathFxEvent({ availableStudies: true });
      break;
    case "enroll":
      if (value === true) {
        enrolled = true;
        disabled = false;
      }
      break;
    case "unenroll":
      if (value === true) {
        enrolled = false;
        disabled = false;
      }
      break;
    case "installStudy":
      dispathFxEvent({ activeStudies: true });
      break;
    case "uninstallStudy":
      dispathFxEvent({ activeStudies: true });
      break;
    default:
      break;
  }
}
