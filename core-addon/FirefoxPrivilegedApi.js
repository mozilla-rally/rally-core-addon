/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
const { TelemetryController } = ChromeUtils.import(
  "resource://gre/modules/TelemetryController.jsm"
);
const { XPCOMUtils } = ChromeUtils.import(
  "resource://gre/modules/XPCOMUtils.jsm"
);

XPCOMUtils.defineLazyServiceGetters(this, {
  gUUIDGenerator: ["@mozilla.org/uuid-generator;1", "nsIUUIDGenerator"],
});

// The pref that contains the Ion ID within Firefox. Unfortunately
// the telemetry APIs require this, therefore it needs to be set in
// prefs even though it will be stored in the standard addon storage area.
const PREF_ION_ID = "toolkit.telemetry.pioneerId";

this.firefoxPrivilegedApi = class extends ExtensionAPI {
  getAPI(context) {
    var self = this;
    return {
      firefoxPrivilegedApi: {
        async submitEncryptedPing(type, payload, options) {
          console.debug(`Ion - Sending ping through legacy telemetry (${type})`);

          // This function will always send encrypted pings.
          let augmentedOptions = options;
          augmentedOptions.useEncryption = true;

          TelemetryController.submitExternalPing(type, payload, options);
        },
        async setIonID(id) {
          Services.prefs.setStringPref(PREF_ION_ID, id);
        },
        async clearIonID() {
          Services.prefs.clearUserPref(PREF_ION_ID);
        },
        async generateUUID() {
          let str = gUUIDGenerator.generateUUID().toString();
          return str.substring(1, str.length - 1);
        }
      }
    }
  }
};
