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
 * Bridge page events to the background script.
 *
 * ** IMPORTANT **
 *
 * All the messages passing through here must NOT BE TRUSTED, as
 * any actor could inject custom scripts and impersonate the web page.
 */
window.addEventListener("web-check", event => {
  console.debug("Rally - 'web-check' message received from the page");
  // TODO: can we automatically get the addon id for the right platform
  // at build time?
  browser
    .runtime
    .sendMessage(
        "rally-core@mozilla.org",
        {type: "web-check", data: {}},
        {}
      )
      .then(
        resolved => sendAddonAliveEvent(),
        // Even if the message was rejected, this script from the addon
        // was still injected, so the addon must be there!
        rejected => sendAddonAliveEvent()
      );
});

console.debug("Rally - Running content script");
// Send an event as soon as injected, to notify the web page if
// it is already open.
sendAddonAliveEvent();
