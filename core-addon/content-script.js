/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

window.browser = require("webextension-polyfill");

/**
 * Send an event to the web page.
 *
 * @param {Object} message
 *        A JSON-serializable object to send back to the
 *        page. It must have the following structure:
 *        {type: "message-type", data: {...}}
 */
function sendToPage(message) {
  console.debug(`Rally: sending response ${message.type} to page`);
  const data = message.data || {};
  window.dispatchEvent(new CustomEvent(message.type, { detail: data }));
}

function sendAddonAliveEvent() {
  sendToPage({type: "web-check-response", data: {}})
}

/**
 * Convenience function to send a message to the Core Add-on.
 *
 * @param {String} type
 *        The message type/name.
 * @param {Object} data
 *        An object containing the data for the message.
 * @returns {Promise} resolved when the message is sent.
 */
async function sendToCore(type, data) {
  // TODO: can we automatically get the addon id for the right platform
  // at build time? See https://github.com/mozilla-rally/rally-core-addon/issues/409
  await browser.runtime.sendMessage(
    "rally-core@mozilla.org",
    {type: type, data: data},
    {}
  )
}

/**
 * Bridge page events to the background script.
 *
 * ** IMPORTANT **
 *
 * All the messages passing through here must NOT BE TRUSTED, as
 * any actor could inject custom scripts and impersonate the web page.
 */
function handlePageEvents(event) {
  console.debug(`Rally - "${event.type}" message received from the page`);

  switch (event.type) {
    case "web-check": {
      sendToCore("web-check").then(
        resolved => sendAddonAliveEvent(),
        // Even if the message was rejected, this script from the addon
        // was still injected, so the addon must be there!
        rejected => sendAddonAliveEvent()
      );
    } break;
    case "open-rally": {
      sendToCore("open-rally").catch(e => {
        console.error(`Rally - unable to open the Core Add-on page`, e);
      });
    } break;
    default:
      console.error(`Rally - unknown message ${event.type} received`);
  }
}

window.addEventListener("web-check", e => handlePageEvents(e));
window.addEventListener("open-rally", e => handlePageEvents(e));

console.debug("Rally - Running content script");
// Send an event as soon as injected, to notify the web page if
// it is already open.
sendAddonAliveEvent();
