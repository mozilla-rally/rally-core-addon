/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('assert').strict;
const fs = require('fs');
const utils = require("./utils.js");
const { By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

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
  await findAndAct(driver, By.xpath(`//button[text()="Accept & Participate"]`), e => e.click());
  // TODO check that state is enrolled, see https://github.com/mozilla-rally/core-addon/issues/245

  await findAndAct(driver, By.xpath(`//button[text()="Save & Continue"]`), e => e.click());
}

const rallyTestStudy = JSON.parse(fs.readFileSync("public/locally-available-studies.json"))[0];

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

describe("Core-Addon", function () {
  it("should un/enroll in Rally", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(initRemoteSettings, rallyTestStudy, 1234567);

    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await installRally(this.driver);
    await joinRally(this.driver);

    await this.driver.wait(until.elementLocated(By.css("button")));
    await findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await findAndAct(this.driver, By.xpath(`(//button[text()="Join Study"])[2]`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await findAndAct(this.driver, By.css(`[label="Okay, Got It"]`), e => e.click());

    // Close options page tab and re-open it.
    await this.driver.close();
    const originalTab = (await this.driver.getAllWindowHandles())[0];
    await this.driver.switchTo().window(originalTab);
    await findAndAct(this.driver, By.id("rally-core_mozilla_org-browser-action"), e => e.click());

    // We expect the extension to load its options page in a new tab.
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length >= 2;
    }, WAIT_FOR_PROPERTY);

    // Selenium is still focused on the old tab, so switch to the new window handle.
    let latestTab = (await this.driver.getAllWindowHandles()).length - 1;
    const newOptionsTab = (await this.driver.getAllWindowHandles())[latestTab];
    await this.driver.switchTo().window(newOptionsTab);

    // Switch context to web content to interact with options page.
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.findElement(baseStudySelector);

    // Begin study unenrollment cancel it.
    await findAndAct(this.driver, By.xpath(`//button[text()="Leave Mozilla Rally"]`), e => e.click());
    await findAndAct(this.driver, By.xpath(`//button[text()="Cancel"]`), e => e.click());

    // Begin unenrollment and confirm it this time.
    const unenrollSelector = By.xpath(`//button[text()="Leave Mozilla Rally"]`);
    const unenrollButton = await this.driver.findElement(unenrollSelector);
    await this.driver.wait(until.elementIsVisible(unenrollButton), WAIT_FOR_PROPERTY);
    unenrollButton.click();

    await this.driver.wait(
      until.titleIs("Rally: Put your data to work for a better internet"),
      WAIT_FOR_PROPERTY
    );

    const confirmButton = await this.driver.findElement(
      By.xpath(`//button[text()="Leave Rally"]`)
    );
    await this.driver.wait(until.elementIsVisible(confirmButton), WAIT_FOR_PROPERTY);
    await confirmButton.click();
    // TODO check that core add-on is uninstalled, see https://github.com/mozilla-rally/core-addon/issues/245

    await this.driver.quit();
  });

  it("Should be disabled on non en-US locales", async function () {
    this.driver = await utils.getFirefoxDriver(true, {
      "intl.accept_languages": "it-IT"
    });

    await installRally(this.driver);

    // Check the content of the page.
    const pageContent = await this.driver.getPageSource();
    assert.ok(pageContent.includes("Sorry, Rally is not supported in this locale."));

    await this.driver.quit();
  });

  it("Should display and respond to Remote Settings changes", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(initRemoteSettings, rallyTestStudy, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await installRally(this.driver);
    await joinRally(this.driver);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.findElement(baseStudySelector);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    const modifiedTestStudy = Object.assign({}, rallyTestStudy);
    modifiedTestStudy.name = "Another Rally Study";
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(updateRemoteSettings, modifiedTestStudy, (1234567 + 1));
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const anotherStudySelector = By.xpath(`//span[text()="Another Rally Study"]`);
    await this.driver.findElement(anotherStudySelector);

    // Check that studies are installable.
    await this.driver.wait(until.elementLocated(By.css("button")));
    await findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await findAndAct(this.driver, By.xpath(`(//button[text()="Join Study"])[2]`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await findAndAct(this.driver, By.css(`[label="Okay, Got It"]`), e => e.click());

    await this.driver.quit();
  });
});
