/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';

export default (cliArgs) => {
  return [
  {
    input: "core-addon/background.js",
    output: {
      file: "public/addon-build/background.js"
    },
    plugins: [
      replace({
        __ION_STUDIES_LIST__: cliArgs['config-study-list-url'] ?
          `'${cliArgs['config-study-list-url']}'` :
          "'https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records'",
        __DISABLE_REMOTE_SETTINGS__: !!cliArgs["config-disable-remote-settings"],
        __ION_WEBSITE_URL__: cliArgs['config-website'] ?
          `'${cliArgs['config-website']}'` :
          "'https://rally-stage.bespoke.nonprod.dataops.mozgcp.net'",
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  },
  {
    input: "core-addon/content-script.js",
    output: {
      file: "public/addon-build/content-script.js"
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  },
]};
