/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const fmt = Intl.DateTimeFormat("en", {month: "short", day: "2-digit", year: "numeric"});

export default function niceDate(dt) {
  return fmt.format(dt);
}
