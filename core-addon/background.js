/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Core } from "./Core.js"
window.browser = require("webextension-polyfill");

const core = new Core({
    availableStudiesURI: __STUDIES_LIST__,
    disableRemoteSettings: __DISABLE_REMOTE_SETTINGS__,
    website: __WEBSITE_URL__,
});
core.initialize();
