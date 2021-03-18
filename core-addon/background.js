/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import "webextension-polyfill";
import "./Core.js";

const core = new Core({
    availableStudiesURI: __STUDIES_LIST__,
    disableRemoteSettings: __DISABLE_REMOTE_SETTINGS__,
    website: __WEBSITE_URL__,
});
core.initialize();
