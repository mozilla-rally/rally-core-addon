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
        // Turn this on to both disable the build-time warning and prepare for future releases,
        // since this will become the default value.
        preventAssignment: true,
        // NOTE: if this URL ever changes, you will have to update the domain in
        // the permissions in manifest.json.
        __STUDIES_LIST__: cliArgs['config-studies-list-url'] ?
          `'${cliArgs['config-studies-list-url']}'` :
          "'https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/rally-studies-v1/records'",
        __DISABLE_REMOTE_SETTINGS__: !!cliArgs["config-disable-remote-settings"],
        __BASE_SITE__: "https://rally.mozilla.org",
        // Data submission is disabled by default. Use this option via the CLI
        // to enable it for testing until https://github.com/mozilla-rally/core-addon/issues/304
        // is fixed.
        __ENABLE_DATA_SUBMISSION__: !!cliArgs["config-enable-data-submission"],
        __WEBSITE_URL__: cliArgs['config-website'] ?
          `'${cliArgs['config-website']}'` :
          "'https://rally.mozilla.org'",
      }),
      resolve({
        exportConditions: ["browser"],
        // This is required in order for rollup to pick up
        // the correct dependencies for ping encryption.
        preferBuiltins: false,
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
