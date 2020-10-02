/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "core-addon/background.js",
  output: {
    file: "public/addon-build/background.js"
  },
  plugins: [
    commonjs(),
  ],
};
