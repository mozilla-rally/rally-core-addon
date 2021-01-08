/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import createStore from "./create-store";
import api from "./api/__API_ENDPOINT__";

const initialValue = __STORE_IMPLEMENTATION__;

export const store = createStore(initialValue, api);
