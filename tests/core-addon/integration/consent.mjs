/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from "assert";
import firefox from "selenium-webdriver/firefox";
import * as utils from "./utils.js";

import { By, until } from "selenium-webdriver";

describe("side-loaded studies found before Rally installs", function () {
  it("pre-existing side-loaded studies must not be joined", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Generate a test study addon.
    const addonId = "preloaded-test-study@mozilla.org";
    let tempDir = await utils.getTempDirectory();
    let addonFile = await utils.generateTestStudyAddon(tempDir, { addonId });

    // Add the test study to the remote settings list.
    const modifiedTestStudy = Object.assign({}, utils.RALLY_TEST_STUDY_REGISTRY);
    modifiedTestStudy.name = "Side-loaded study";
    modifiedTestStudy.addonId = addonId;
    modifiedTestStudy.downloadLink = addonFile;

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, modifiedTestStudy, 1234567);

    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    const studyInstallId = await this.driver.installAddon(addonFile);
    let studyInstalled = await utils.isAddonInstalled(this.driver, studyInstallId);
    assert.ok(studyInstalled);

    // Installing the study will open an "Install Rally" page.
    // Once it's opened, close it.
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length === 2;
    }, utils.WAIT_FOR_PROPERTY);
    const openedTabs = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(openedTabs[1]);
    await this.driver.close();
    await this.driver.switchTo().window(openedTabs[0]);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    await this.driver.wait(until.elementLocated(By.css("button")));
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
  
    // The following operation will reject because we cannot install
    // an add-on, through a link, from the disk. It's fine, we don't
    // care about this problem in this test, so just catch the network
    // error.  
    assert.rejects(
      utils.findAndAct(this.driver, By.xpath(`(//button[text()="Join Study"])[2]`), e => e.click())
    );
    
    await this.driver.uninstallAddon(studyInstallId);
    
    // Clicking "Join" must have triggered the uninstallation of
    // the existing study.
    studyInstalled = await utils.isAddonInstalled(this.driver, studyInstallId);
    assert.ok(!studyInstalled);
    await this.driver.quit();
  });

  it("studies side-loaded after Rally must not be joined", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Generate a test study addon.
    const addonId = "preloaded-test-study@mozilla.org";
    let tempDir = await utils.getTempDirectory();
    let addonFile = await utils.generateTestStudyAddon(tempDir, { addonId });

    // Add the test study to the remote settings list.
    const modifiedTestStudy = Object.assign({}, utils.RALLY_TEST_STUDY_REGISTRY);
    modifiedTestStudy.name = "Side-loaded study";
    modifiedTestStudy.addonId = addonId;
    modifiedTestStudy.downloadLink = addonFile;

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, modifiedTestStudy, 1234567);

    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    // After Rally is joined, side-load the study.
    const studyInstallId = await this.driver.installAddon(addonFile);
    let studyInstalled = await utils.isAddonInstalled(this.driver, studyInstallId);
    assert.ok(studyInstalled);

    // Installing the study will open an "Install Rally" page.
    // Even though the Rally Core Add-on is installed, the study
    // is not joined.
    // Once it's opened, close it.
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length === 3;
    }, utils.WAIT_FOR_PROPERTY);
    const openedTabs = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(openedTabs[2]);
    await this.driver.close();
    await this.driver.switchTo().window(openedTabs[1]);

    // Make sure to find the "join" button on the study page.
    await this.driver.wait(until.elementLocated(By.css("button")));
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
   
    await this.driver.quit();
  });
});
