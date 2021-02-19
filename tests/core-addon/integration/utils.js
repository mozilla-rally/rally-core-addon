/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import archiver from "archiver";
import { Builder, By, Capabilities, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import fs from "fs";
import os from "os";
import path from "path";
import { Readable } from "stream";

// An object containing the sample remote-settings read from
// a local file: they must contain, at least, the study template
// add-on that has been published.
const RALLY_TEST_STUDY_REGISTRY =
  JSON.parse(fs.readFileSync("public/locally-available-studies.json"))[0];

const STUDY_BACKGROUND_SCRIPT = `
import Rally from './rally.js';
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

const STUDY_BACKGROUND_PAGE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <script type="module" src="background.js"></script>
  </head>
  <body>
  </body>
</html>`;


// The number of milliseconds to wait for some
// property to change in tests. This should be
// a long time to account for slow CI.
const WAIT_FOR_PROPERTY = 5000;

/**
 * Find the element and perform an action on it.
 *
 * @param driver
 *        The Selenium driver to use.
 * @param element
 *        The element to look for and execute actions on.
 * @param action
 *        A function in the form `e => {}` that will be called
 *        and receive the element once ready.
 */
async function findAndAct(driver, element, action) {
  await driver.wait(until.elementLocated(element), WAIT_FOR_PROPERTY);
  await driver.findElement(element).then(e => action(e));
}

/**
 * Generate a Rally test study add-on.
 *
 * @param {String} directory
 *        The directory in which to create the add-on file.
 * @param {Object} [options={}]
 *        An optional set of options for the study.
 * @param {String} [options.addonId="rally-integration-test@mozilla.org"]
 *        A string containing the addon id to use for the study.
 * @param {String} [options.backgroundScript=STUDY_BACKGROUND_SCRIPT]
 *        A string containing the code for the background script.
 *
 * @return {String} the full path of the addon file.
 */
async function generateTestStudyAddon(
  directory,
  options={}
) {
  const addonId =
    options.addonId || "rally-integration-test@mozilla.org";
  const manifest = `
{
  "manifest_version": 2,
  "name": "Rally Integration Test Add-on",
  "version": "1.0",
  "applications": {
    "gecko": {
      "id": "${addonId}",
      "strict_min_version": "84.0a1"
    }
  },
  "permissions": [],
  "background": {
    "page": "background.html"
  }
}
`;
  let tempFile =
    path.join(directory, "test-rally-study.xpi");

  const backgroundScript =
    options.backgroundScript || STUDY_BACKGROUND_SCRIPT;

  var output = fs.createWriteStream(tempFile);
  var archive = archiver("zip", { store: true });
  archive.on("error", err => { throw err; });
  archive.pipe(output);

  // For this to be a valid study add-on, we need: a manifest,
  // rally.js and a background script.
  await archive
    .append(Readable.from(manifest), { name: "manifest.json" })
    .append(Readable.from(STUDY_BACKGROUND_PAGE), { name: "background.html" })
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
 * Check whether or not a specific addon is installed.
 *
 * @param {Object} driver
 *        The Selenium WebDriver.
 * @param {String} addonId
 *        The addon id.
 * @returns {Promise} resolved with true if the addon is installed.
 */
async function isAddonInstalled(driver, addonId) {
  let originalContext = await driver.getContext();

  await driver.setContext(firefox.Context.CHROME);

  // Invoke the addon manager to figure out if the addon is installed.
  let queryAddonManager = async function (id) {
    const { AddonManager } = ChromeUtils.import("resource://gre/modules/AddonManager.jsm");
    
    return await AddonManager.getAddonByID(id) !== null;
  }

  let result =
    await driver.executeScript(queryAddonManager, addonId);

  await driver.setContext(originalContext);

  return result;
}

/**
 * Install the Rally extension, but do not join Rally.
 *
 * Leaves the Selenium driver context set to CONTENT, and
 * focused on the options page.
 */
async function installRally(driver) {
  await driver.get(`file:///${__dirname}/index.html`);
  await driver.wait(until.titleIs("Installation Test"), WAIT_FOR_PROPERTY);
  await findAndAct(driver, By.id("install"), e => e.click());

  // switch to browser UI context, to interact with Firefox add-on install prompts.
  await driver.setContext(firefox.Context.CHROME);
  await findAndAct(driver, By.css(`[label="Add"]`), e => e.click());
  await findAndAct(driver, By.css(`[label="Okay, Got It"]`), e => e.click());

  // We expect the extension to load its options page in a new tab.
  await driver.wait(async () => {
    return (await driver.getAllWindowHandles()).length === 2;
  }, WAIT_FOR_PROPERTY);

  // Selenium is still focused on the old tab, so switch to the new window handle.
  const newTab = (await driver.getAllWindowHandles())[1];
  await driver.switchTo().window(newTab);

  // Switch back to web content context.
  await driver.setContext(firefox.Context.CONTENT);

  // New tab is focused, now on options page.
  await driver.wait(
    until.titleIs("Rally: Put your data to work for a better internet"),
    WAIT_FOR_PROPERTY
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

/**
 * Join Rally.
 * Assumes that the Rally core add-on is already installed, and
 * focused on the options page.
 *
 * Leaves the Selenium driver context set to CONTENT, and
 * focused on the options page.
 */
async function joinRally(driver) {
  await driver.wait(until.elementLocated(By.css("button")));

  // FIXME we need to use button IDs here so xpath is not needed...
  // See https://github.com/mozilla-rally/core-addon/issues/244
  await findAndAct(driver, By.xpath(`//button[text()="Get Started"]`), e => e.click());
  await findAndAct(driver, By.xpath(`//button[text()="Accept & Enroll"]`), e => e.click());
  // TODO check that state is enrolled, see https://github.com/mozilla-rally/core-addon/issues/245

  await findAndAct(driver, By.xpath(`//button[text()="Save & Continue"]`), e => e.click());
}

module.exports = {
  RALLY_TEST_STUDY_REGISTRY,
  WAIT_FOR_PROPERTY,
  findAndAct,
  generateTestStudyAddon,
  getFirefoxDriver,
  getTempDirectory,
  initRemoteSettings,
  updateRemoteSettings,
  isAddonInstalled,
  installRally,
  joinRally,
};
