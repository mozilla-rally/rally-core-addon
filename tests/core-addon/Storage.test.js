/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var sinon = require('sinon');

var Storage = require('../../core-addon/Storage');

describe('Storage', function () {
  beforeEach(function () {
    this.storage = new Storage();
  });

  describe('appendActivatedStudy()', async function () {
    it('should correctly append studies on first run', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).resolves();

      let storedIds = await this.storage.appendActivatedStudy(TEST_ADDON_ID);

      assert.equal(storedIds.length, 1);
      assert.ok(storedIds.includes(TEST_ADDON_ID));
    });

    it('should correctly append on read errors', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).throws();

      let storedIds = await this.storage.appendActivatedStudy(TEST_ADDON_ID);

      assert.equal(storedIds.length, 1);
      assert.ok(storedIds.includes(TEST_ADDON_ID));
    });

    it('should append the same id only once', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [TEST_ADDON_ID]})
        .resolves();

      let storedIds = await this.storage.appendActivatedStudy(TEST_ADDON_ID);

      assert.equal(storedIds.length, 1);
      assert.ok(storedIds.includes(TEST_ADDON_ID));
    });
  });

  afterEach(function () {
    chrome.flush();
  });
});
