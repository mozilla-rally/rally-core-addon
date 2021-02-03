/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

window.browser = require("webextension-polyfill");
const Core = require("./Core.js");

const core = new Core({
    availableStudiesURI: __ION_STUDIES_LIST__,
    disableRemoteSettings: __DISABLE_REMOTE_SETTINGS__,
    website: __ION_WEBSITE_URL__,
});
core.initialize();
