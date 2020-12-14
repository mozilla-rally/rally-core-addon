/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { TelemetryController } = ChromeUtils.import(
  "resource://gre/modules/TelemetryController.jsm"
);
const { XPCOMUtils } = ChromeUtils.import(
  "resource://gre/modules/XPCOMUtils.jsm"
);

XPCOMUtils.defineLazyServiceGetters(this, {
  gUUIDGenerator: ["@mozilla.org/uuid-generator;1", "nsIUUIDGenerator"],
});

this.firefoxPrivilegedApi = class extends ExtensionAPI {
  getAPI(context) {
    return {
      firefoxPrivilegedApi: {
        async submitEncryptedPing(type, payload, options) {
          console.debug(`Ion - Sending ping through legacy telemetry (${type})`);

          // This function will always send encrypted pings.
          let augmentedOptions = options;
          augmentedOptions.useEncryption = true;

          TelemetryController.submitExternalPing(type, payload, options);
        },
        async generateUUID() {
          // eslint-disable-next-line no-undef
          let str = gUUIDGenerator.generateUUID().toString();
          return str.substring(1, str.length - 1);
        }
      }
    }
  }
};
