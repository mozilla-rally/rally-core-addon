/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('assert').strict;
const utils = require("./utils.js");
const { By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

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
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Join Study"])[2]`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay, Got It"]`), e => e.click());

    // Close options page tab and re-open it.
    await this.driver.close();
    const originalTab = (await this.driver.getAllWindowHandles())[0];
    await this.driver.switchTo().window(originalTab);
    await utils.findAndAct(this.driver, By.id("rally-core_mozilla_org-browser-action"), e => e.click());

    // We expect the extension to load its options page in a new tab.
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length >= 2;
    }, utils.WAIT_FOR_PROPERTY);

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
    await utils.findAndAct(this.driver, By.xpath(`(//button[text()="Join Study"])[2]`), e => e.click());

    // Switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await utils.findAndAct(this.driver, By.css(`[label="Add"]`), e => e.click());
    await utils.findAndAct(this.driver, By.css(`[label="Okay, Got It"]`), e => e.click());

    await this.driver.quit();
  });
});
