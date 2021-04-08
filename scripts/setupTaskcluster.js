/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as exec from "child_process";

// If this is not running on TaskCluster, exit
// without an error code.
if ('TASK_ID' in process.env) {
  console.log("Running in TaskCluster. Running set-up.");

  // The TaskCluster instance on the Mozilla add-ons pipeline
  // does not allow image customization, so python3 venv cannot
  // be installed. That package is required for Glean to build.
  // We make sure to have all the dependencies in place when on
  // TaskCluster by running the commands manually.
  exec.exec("sudo apt-get -y install python3-venv");
}
