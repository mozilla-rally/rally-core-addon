/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { XPCOMUtils } = ChromeUtils.import(
  "resource://gre/modules/XPCOMUtils.jsm"
);

/* global RemoteSettings TelemetryController */
XPCOMUtils.defineLazyModuleGetters(this, {
  RemoteSettings: "resource://services-settings/remote-settings.js",
  TelemetryController: "resource://gre/modules/TelemetryController.jsm",
});

/* global gUUIDGenerator */
XPCOMUtils.defineLazyServiceGetters(this, {
  gUUIDGenerator: ["@mozilla.org/uuid-generator;1", "nsIUUIDGenerator"],
});

/**
 * This is the Remote Settings collection key also known as "CID" in the official documentation.
 * @see https://remote-settings.readthedocs.io/en/latest/getting-started.html
 *
 * NOTE - we cannot control which Remote Settings server that Firefox uses, so we assume that this
 * is a global key that will be correct no matter which server is used (dev, staging, release, etc.)
 */
const STUDY_COLLECTION_KEY = "rally-studies-v1";

this.firefoxPrivilegedApi = class extends ExtensionAPI {
  getAPI(context) {
    return {
      firefoxPrivilegedApi: {
        async submitEncryptedPing(type, payload, options) {
          console.debug(`Sending ping through legacy telemetry (${type})`);

          // This function will always send encrypted pings.
          let augmentedOptions = options;
          augmentedOptions.useEncryption = true;

          TelemetryController.submitExternalPing(type, payload, options);
        },
        async generateUUID() {
          let str = gUUIDGenerator.generateUUID().toString();
          return str.substring(1, str.length - 1);
        },
        async getRemoteSettings() {
          return RemoteSettings(STUDY_COLLECTION_KEY).get();
        },
        // eslint-disable-next-line no-undef
        onRemoteSettingsSync: new ExtensionCommon.EventManager({
          context,
          name: "firefoxPrivilegedApi.onRemoteSettingsSync",
          // Fire a callback to listener when remote settings collection updates, passing the contents of the collection.
          register: (fire) => {
            const callback = (current) => {
              fire.async(current).catch(() => { }); // ignore Message Manager disconnects
            };
            async function rsCallback(event) {
              let {
                data: { current },
              } = event;
              callback(current);
            }
            RemoteSettings(STUDY_COLLECTION_KEY).on("sync", rsCallback);
            return () => {
              RemoteSettings(STUDY_COLLECTION_KEY).off("sync", rsCallback);
            };
          },
        }).api(),
      },
    };
  }
  onShutdown() {
    RemoteSettings(STUDY_COLLECTION_KEY).db.clear()
  }
};
