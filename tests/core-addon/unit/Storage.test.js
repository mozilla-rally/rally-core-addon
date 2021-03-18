/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';

import Storage from '../../../core-addon/Storage.js';

describe('Storage', function () {
  beforeEach(function () {
    this.storage = new Storage();
  });

  describe('getItem()', function () {
    it('should return undefined on errors', async function () {
      chrome.storage.local.get.rejects();

      let stored = await this.storage.getItem("irrelevant-key");

      assert.ok(stored === undefined);
    });
  });

  describe('appendActivatedStudy()', function () {
    it('should correctly append studies on first run', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).resolves();
      browser.storage.local.set.yields();

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
      browser.storage.local.set.yields();

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
      browser.storage.local.set.yields();

      let storedIds = await this.storage.appendActivatedStudy(TEST_ADDON_ID);

      assert.equal(storedIds.length, 1);
      assert.ok(storedIds.includes(TEST_ADDON_ID));
    });
  });

  describe('removeActivatedStudy()', function () {
    it('should correctly remove on read errors', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {activatedStudies: [TEST_ADDON_ID]}).throws();

      let storedIds = await this.storage.removeActivatedStudy(TEST_ADDON_ID);

      assert.equal(storedIds.length, 0);
      assert.ok(!storedIds.includes(TEST_ADDON_ID));
    });

    it('should pass through same studies if addon id is not in activated studies', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: ['something-else']})
        .resolves();

      let storedIds = await this.storage.removeActivatedStudy(TEST_ADDON_ID);
      assert.equal(storedIds.length, 1);
      assert.ok(!storedIds.includes(TEST_ADDON_ID));
      assert.ok(storedIds.includes('something-else'));
    });

    it('should remove the same id only once', async function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [TEST_ADDON_ID]})
        .resolves();

      let storedIds = await this.storage.removeActivatedStudy(TEST_ADDON_ID);
      assert.equal(storedIds.length, 0);
      assert.ok(!storedIds.includes(TEST_ADDON_ID));
    });
  });

  describe('pending consent', function () {
    it('addPendingConsent does not add the same id twice', function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      this.storage.addPendingConsent(TEST_ADDON_ID);
      this.storage.addPendingConsent(TEST_ADDON_ID);
      const consentedStudies = this.storage.pendingConsents;
      assert.equal(consentedStudies.length, 1);
      assert.ok(consentedStudies.includes(TEST_ADDON_ID));
    });

    it('removePendingConsent returns false for unknown ids', function () {
      assert.ok(
        !this.storage.removePendingConsent("i-do-not-exist")
      );
    });

    it('removePendingConsent returns true for known ids', function () {
      const TEST_ADDON_ID = "test-id@ion.com";
      this.storage.addPendingConsent(TEST_ADDON_ID);

      assert.equal(this.storage.pendingConsents.length, 1);

      assert.ok(
        this.storage.removePendingConsent(TEST_ADDON_ID)
      );

      assert.equal(this.storage.pendingConsents.length, 0);
    });
  });

  afterEach(function () {
    chrome.flush();
  });
});
