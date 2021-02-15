/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { Builder, Capabilities } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");

// An object containing the sample remote-settings read from
// a local file: they must contain, at least, the study template
// add-on that has been published.
const RALLY_TEST_STUDY_REGISTRY =
  JSON.parse(fs.readFileSync("public/locally-available-studies.json"))[0];

const STUDY_BACKGROUND_SCRIPT = `
const rally = new Rally();
rally.initialize(
  // A sample key id used for encrypting data.
  "sample-invalid-key-id",
  // A sample *valid* JWK object for the encryption.
  {
    "kty":"EC",
    "crv":"P-256",
    "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
    "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
    "kid":"Public key used in JWS spec Appendix A.3 example"
  }
);`;

/**
 * Generate a Rally test study add-on.
 *
 * @param {String} directory
 *        The directory in which to create the add-on file.
 * @param {String} [backgroundScript=STUDY_BACKGROUND_SCRIPT]
 *        A string containing the code for the background script.
 *
 * @return {String} the full path of the addon file.
 */
async function generateTestStudyAddon(
  directory,
  backgroundScript=STUDY_BACKGROUND_SCRIPT
) {
  // Define the manifest.
  const manifest = `
{
  "manifest_version": 2,
  "name": "Rally Integration Test Add-on",
  "version": "1.0",
  "applications": {
    "gecko": {
      "id": "rally-integration-test@mozilla.org",
      "strict_min_version": "84.0a1"
    }
  },
  "permissions": [],
  "background": {
    "scripts": [
      "rally.js",
      "background.js"
    ]
  }
}
`;
  let tempFile =
    path.join(directory, "test-rally-study.xpi");

  var output = fs.createWriteStream(tempFile);
  var archive = archiver("zip", { store: true });
  archive.on("error", err => { throw err; });
  archive.pipe(output);

  // For this to be a valid study add-on, we need: a manifest,
  // rally.js and a background script.
  await archive
    .append(Readable.from(manifest), { name: "manifest.json" })
    .append(
      Readable.from(backgroundScript), { name: "background.js" })
    .append(
      fs.createReadStream("./support/rally.js"), { name: 'rally.js' })
    .finalize();

  return tempFile;
}

/**
 * Get a Selenium driver for using the Firefox browser.
 *
 * @param {Boolean} headless
 *        Whether or not to run Firefox in headless mode.
 * @param {Object} prefsOverride
 *        The properties of this object are a key-value
 *        representation of the preferences to set.
 * @returns {WebDriver} a WebDriver instance to control Firefox.
 */
async function getFirefoxDriver(headless, prefsOverride) {
  const firefoxOptions = new firefox.Options();
  firefoxOptions.setPreference("xpinstall.signatures.required", false);
  firefoxOptions.setPreference("extensions.experiments.enabled", true);

  if (prefsOverride) {
    for (let [pref, value] of Object.entries(prefsOverride)) {
      firefoxOptions.setPreference(pref, value);
    }
  }

  if (headless) {
    firefoxOptions.headless();
  }

  if (process.platform === "linux") {
    // Look for the Firefox executable in different locations.
    const FIREFOX_PATHS = [
      "/usr/bin/firefox-trunk",
      "/usr/bin/firefox",
    ];

    for (const path of FIREFOX_PATHS) {
      if (fs.existsSync(path)) {
        firefoxOptions.setBinary(path);
        break;
      }
    }
  } else if (process.platform === "darwin") {
    firefoxOptions.setBinary(
      "/Applications/Firefox Nightly.app/Contents/MacOS/firefox"
    );
  }

  return await new Builder()
    .forBrowser("firefox")
    .withCapabilities(Capabilities.firefox())
    .setFirefoxOptions(firefoxOptions)
    .build();
}

/**
 * Get a temporary directory.
 *
 * @returns {String} the path to a temporary directory.
 */
async function getTempDirectory() {
  return await new Promise((resolve, reject) => fs.mkdtemp(
      path.join(os.tmpdir(), 'rally-test-'),
      (err, directory) => {
        if (err) {
          reject(err);
        }
        resolve(directory);
      }
    )
  );
}

/**
 * Initialize Remote Settings and populate the local database with test studies.
 * Intended to be run by `driver.executeScript()` in CHROME context.
 */
async function initRemoteSettings(testStudy, timestamp) {
  const { RemoteSettings } = ChromeUtils.import("resource://services-settings/remote-settings.js");
  const remoteSettingsKey = "rally-studies-v1";

  const db = await RemoteSettings(remoteSettingsKey).db;
  await db.create(testStudy);
  await db.importChanges({}, timestamp);

  await RemoteSettings(remoteSettingsKey).get();
}

/**
 * Trigger a Remote Settings update.
 */
async function updateRemoteSettings(modifiedTestStudy, timestamp) {
  const { RemoteSettings } = ChromeUtils.import("resource://services-settings/remote-settings.js");
  const remoteSettingsKey = "rally-studies-v1";

  await RemoteSettings(remoteSettingsKey).emit("sync", { data: { current: [modifiedTestStudy] } });
}

module.exports = {
  RALLY_TEST_STUDY_REGISTRY,
  getFirefoxDriver,
  getTempDirectory,
  initRemoteSettings,
  updateRemoteSettings,
};
