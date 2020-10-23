/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';

export default (cliArgs) => {
  return {
  input: "core-addon/background.js",
  output: {
    file: "public/addon-build/background.js"
  },
  plugins: [
    replace({
      __ION_STUDIES_LIST__: cliArgs['config-study-list-url'] ?
        `'${cliArgs['config-study-list-url']}'` :
        "'https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records'",
      __ION_WEBSITE_URL__: cliArgs['config-website'] ?
        `'${cliArgs['config-website']}'` :
        "'https://mozilla-ion.github.io'",
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
  ],
}};
