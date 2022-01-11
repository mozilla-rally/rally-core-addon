/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';
import * as utils from "./utils.js";
import { By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

describe("Core-Addon", function () {
  it("should un/enroll in Rally", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, utils.RALLY_TEST_STUDY_REGISTRY, 1234567);

    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    await this.driver.wait(until.elementLocated(By.css("button")));
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Accept & Enroll"])`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay"]`), e => e.click());

    // Close options page tab and re-open it.
    await this.driver.close();
    const originalTab = (await this.driver.getAllWindowHandles())[0];
    await this.driver.switchTo().window(originalTab);
    await utils.findAndAct(this.driver, By.id("rally-core_mozilla_org-browser-action"), e => e.click());

    // We expect the extension to load its options page in a new tab.
    const newOptionsTab = (await this.driver.getAllWindowHandles())[0];
    await this.driver.switchTo().window(newOptionsTab);

    // Switch context to web content to interact with options page.
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.findElement(baseStudySelector);

    // Begin study unenrollment cancel it.
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Leave Mozilla Rally"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Cancel"]`), e => e.click());

    // Begin unenrollment and confirm it this time.
    const unenrollSelector = By.xpath(`//button[text()="Leave Mozilla Rally"]`);
    const unenrollButton = await this.driver.findElement(unenrollSelector);
    await this.driver.wait(until.elementIsVisible(unenrollButton), utils.WAIT_FOR_PROPERTY);
    unenrollButton.click();

    await this.driver.wait(
      until.titleIs("Rally: Put your data to work for a better internet"),
      utils.WAIT_FOR_PROPERTY
    );

    const confirmButton = await this.driver.findElement(
      By.xpath(`//button[text()="Leave Rally"]`)
    );
    await this.driver.wait(until.elementIsVisible(confirmButton), utils.WAIT_FOR_PROPERTY);
    await confirmButton.click();
    // TODO check that core add-on is uninstalled, see https://github.com/mozilla-rally/core-addon/issues/245

    await this.driver.quit();
  });

  it("Should be disabled on non en-US locales", async function () {
    this.driver = await utils.getFirefoxDriver(true, {
      "intl.accept_languages": "it-IT"
    });

    await utils.installRally(this.driver);

    // Check the content of the page.
    const pageContent = await this.driver.getPageSource();
    assert.ok(pageContent.includes("At this time, Mozilla Rally is only available to participants based in the U.S."));

    await this.driver.quit();
  });

  it("Should display and respond to Remote Settings changes", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, utils.RALLY_TEST_STUDY_REGISTRY, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.findElement(baseStudySelector);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    const modifiedTestStudy = Object.assign({}, utils.RALLY_TEST_STUDY_REGISTRY);
    modifiedTestStudy.name = "Another Rally Study";
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, (1234567 + 1));
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const anotherStudySelector = By.xpath(`//span[text()="Another Rally Study"]`);
    await this.driver.wait(until.elementLocated(anotherStudySelector), utils.WAIT_FOR_PROPERTY);
    await this.driver.findElement(anotherStudySelector);

    // Check that studies are installable.
    await this.driver.wait(until.elementLocated(By.css("button")));
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Accept & Enroll"])`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay"]`), e => e.click());

    await this.driver.quit();
  });

  it("Should display hidden studies only if already joined", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, utils.RALLY_TEST_STUDY_REGISTRY, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    const modifiedTestStudy = Object.assign({}, utils.RALLY_TEST_STUDY_REGISTRY);
    // Mark study as paused.
    modifiedTestStudy.studyPaused = true;
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Check that no studies are displayed.
    const noStudySelector = By.xpath(`//div[text()="No available studies"]`);
    await this.driver.wait(until.elementLocated(noStudySelector), utils.WAIT_FOR_PROPERTY);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    // No more paused studies.
    modifiedTestStudy.studyPaused = false;
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, (1234567 + 2));
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.wait(until.elementLocated(baseStudySelector), utils.WAIT_FOR_PROPERTY);
    await this.driver.findElement(baseStudySelector);

    // Install study, so we can ensure that marking it paused does not hide the "leave" functionality.
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Accept & Enroll"])`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay"]`), e => e.click());

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    // The study is once again set as paused.
    modifiedTestStudy.studyPaused = true;
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, (1234567 + 3));

    // We expect the study to open its own options page tab, navigate back to the core add-on options page.
    await utils.findAndAct(this.driver, By.id("rally-core_mozilla_org-browser-action"), e => e.click());

    // Switch back to web content context (core add-on options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Leave Study"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Leave Study"])[2]`), e => e.click());

    // No studies are available, because the paused study was removed.
    await this.driver.wait(until.elementLocated(noStudySelector), utils.WAIT_FOR_PROPERTY);

    await this.driver.quit();
  });

  it("Should filter out studies that are too old for core add-on", async function () {
    this.driver = await utils.getFirefoxDriver(true, {});

    // Switch to browser UI context, so we can inject script to set up Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.initRemoteSettings, utils.RALLY_TEST_STUDY_REGISTRY, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    await utils.installRally(this.driver);
    await utils.joinRally(this.driver);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    const modifiedTestStudy = Object.assign({}, utils.RALLY_TEST_STUDY_REGISTRY);
    // Mark study as paused.
    // Check that a far future version of the core add-on is incompatible.
    modifiedTestStudy.minimumCoreVersion = "1000.0.1";
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, 1234567);
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Check that no studies are displayed.
    const noStudySelector = By.xpath(`//div[text()="No available studies"]`);
    await this.driver.wait(until.elementLocated(noStudySelector), utils.WAIT_FOR_PROPERTY);

    // Switch to browser UI context, so we can inject script to modify Remote Settings.
    await this.driver.setContext(firefox.Context.CHROME);
    // Check that a far past version of the core add-on is compatible.
    modifiedTestStudy.minimumCoreVersion = "0.0.1";
    await this.driver.executeScript(utils.updateRemoteSettings, modifiedTestStudy, (1234567 + 2));
    // Switch back to web content context (options page).
    await this.driver.setContext(firefox.Context.CONTENT);

    // Ensure that the study card for the base study is displayed.
    const baseStudySelector = By.xpath(`//span[text()="Rally Base Study"]`);
    await this.driver.wait(until.elementLocated(baseStudySelector), utils.WAIT_FOR_PROPERTY);
    await this.driver.findElement(baseStudySelector);

    // Install study, so we can ensure that marking it paused does not hide the "leave" functionality.
    await utils.findAndAct(this.driver, By.xpath(`//button[text()="Join Study"]`), e => e.click());
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Accept & Enroll"])`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay"]`), e => e.click());

    await this.driver.quit();
  });
});
