/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const chrome = require('sinon-chrome/extensions');
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

var browser = require("webextension-polyfill");

exports.mochaHooks = {
  beforeAll() {
    global.chrome = chrome;
    global.browser = browser;
    // TODO: remove the next line once https://github.com/mozilla-rally/core-addon/issues/304
    // is merged.
    global.__ENABLE_DATA_SUBMISSION__ = true;
    global.__ENABLE_GLEAN__ = true;
  },
  afterAll() {
    chrome.flush();
    delete global.chrome;
    delete global.browser;
    // TODO: remove the next line once https://github.com/mozilla-rally/core-addon/issues/304
    // is merged.
    delete global.__ENABLE_DATA_SUBMISSION__;
    delete global.__ENABLE_GLEAN__;
  },
};
