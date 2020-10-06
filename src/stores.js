import createStore from "./create-store";
import api from "./api/__API_ENDPOINT__";
const initialValue = __STORE_IMPLEMENTATION__;

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

export const store = createStore(initialValue, api);
