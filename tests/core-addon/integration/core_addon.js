/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const firefox = require("selenium-webdriver/firefox");
const { Builder, By, until } = require("selenium-webdriver");

const firefoxOptions = new firefox.Options();
firefoxOptions.setPreference("xpinstall.signatures.required", false);
firefoxOptions.setPreference("extensions.experiments.enabled", true);
// Unset this to run the UI (useful for local testing).
// firefoxOptions.headless();

// This is the path to Firefox Nightly on Ubuntu with the Mozilla PPA.
if (process.platform === "linux") {
  firefoxOptions.setBinary("/usr/bin/firefox-trunk");
} else if (process.platform === "darwin") {
  firefoxOptions.setBinary(
    "/Applications/Firefox Nightly.app/Contents/MacOS/firefox"
  );
}

describe("Core-Addon Onboarding", function () {
  // eslint-disable-next-line mocha/no-hooks-for-single-case
  beforeEach(async function () {
    this.driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(firefoxOptions)
      .build();
  });

  // eslint-disable-next-line mocha/no-hooks-for-single-case
  afterEach(async function () {
    await this.driver.quit();
  });

  it("should un/enroll in Rally", async function () {
    await this.driver.get(`file:///${__dirname}/index.html`);
    await this.driver.wait(until.titleIs("Installation Test"), 1000);
    await this.driver.findElement(By.id("install")).click();

    // switch to browser UI context, to interact with Firefox add-on install prompts.
    await this.driver.setContext(firefox.Context.CHROME);
    await this.driver.findElement(By.css(`[label="Add"]`)).click();
    await this.driver.findElement(By.css(`[label="Okay, Got It"]`)).click();

    // Switch back to web content context.
    await this.driver.setContext(firefox.Context.CONTENT);

    // We expect the extension to load its options page in a new tab.
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length === 2;
    }, 1000);

    // Selenium is still focused on the old tab, so switch to the new window handle.
    const newTab = (await this.driver.getAllWindowHandles())[1];
    await this.driver.switchTo().window(newTab);

    // New tab is focused.
    await this.driver.wait(
      until.titleIs("Ion: Put your data to work for a better internet"),
      1000
    );

    await this.driver.wait(until.elementLocated(By.css("button")));

    // FIXME we need to use button IDs here so xpath is not needed...
    // See https://github.com/mozilla-ion/ion-core-addon/issues/244
    await this.driver
      .findElement(By.xpath(`//button[text()="Get Started"]`))
      .click();
    await this.driver
      .findElement(By.xpath(`//button[text()="Accept & Participate"]`))
      .click();
    // TODO check that state is enrolled, see https://github.com/mozilla-ion/ion-core-addon/issues/245

    await this.driver
      .findElement(By.xpath(`//button[text()="Save & Continue"]`))
      .click();

    await this.driver.wait(until.elementLocated(By.css("button")));
    await this.driver
      .findElement(By.xpath(`//button[text()="Join Study"]`))
      .click();

    const joinStudyConfirmSelector = `(//button[text()="Join Study"])[2]`;
    await this.driver.wait(
      until.elementLocated(By.xpath(joinStudyConfirmSelector)),
      1000
    );
    await this.driver.findElement(By.xpath(joinStudyConfirmSelector)).click();

    // Switch to browser UI context, to interact with Firefox add-on install prompts.

    await this.driver.setContext(firefox.Context.CHROME);
    const continueSelector = By.css(`[label="Continue to Installation"]`);
    await this.driver.wait(until.elementLocated(continueSelector), 1000);
    await this.driver.findElement(continueSelector).click();
    await this.driver.findElement(By.css(`[label="Add"]`)).click();
    await this.driver.findElement(By.css(`[label="Okay, Got It"]`)).click();

    // FIXME close tab and click on icon, check that post-enrollment options page is shown.
    // This will currently fail because there is a bug in the core-addon UI, where
    // the options page will show no studies.
    // See https://github.com/mozilla-ion/ion-core-addon/issues/235

    // Switch back to web content context.
    await this.driver.setContext(firefox.Context.CONTENT);

    // Begin study unenrollment cancel it.
    const unenrollSelector = By.xpath(`//button[text()="Leave Mozilla Rally"]`);
    const unenrollButton = await this.driver.findElement(unenrollSelector);
    unenrollButton.click();

    const cancelSelector = By.xpath(`//button[text()="Cancel"]`);
    await this.driver.wait(until.elementLocated(cancelSelector), 1000);
    await this.driver.findElement(cancelSelector).click();

    // Begin unenrollment and confirm it this time.
    await this.driver.wait(until.elementIsVisible(unenrollButton), 1000);
    unenrollButton.click();

    await this.driver.wait(
      until.titleIs("Ion: Put your data to work for a better internet"),
      1000
    );

    const confirmButton = await this.driver.findElement(
      By.xpath(`//button[text()="Leave Rally"]`)
    );
    await this.driver.wait(until.elementIsVisible(confirmButton), 1000);
    confirmButton.click();
    // TODO check that core add-on is uninstalled, see https://github.com/mozilla-ion/ion-core-addon/issues/245
  });
});
