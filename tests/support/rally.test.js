/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert').strict;

var Rally = require('../../support/rally');

describe('Rally', function () {
  beforeEach(function () {
    this.rally = new Rally();
  });

  describe('initialize()', function () {
    it('must fail with invalid keys', function () {
      assert.rejects(
        this.rally.initialize("key-id", "not-an-object, will fail")
      );
    });

    it('no core addon skips the info page in dev mode', async function () {
      // Mock the check to make it fail.
      this.rally._checkRallyCore = async () => {
        throw "Core Add-On not available.";
      };

      await this.rally.initialize(
        "key-id",
        {},
        true, // Developer mode.
      );

      assert.ok(browser.tabs.create.notCalled);
    });

    it('no core addon opens an info page in production', async function () {
      chrome.tabs.create.yields();

      // Mock the check to make it fail.
      this.rally._checkRallyCore = async () => {
        throw "Core Add-On not available.";
      };

      await this.rally.initialize(
        "key-id",
        {},
      );

      assert.ok(chrome.tabs.create.calledOnce);
    });
  });

  describe('_checkRallyCore()', function () {
    it('must reject if no core addon is installed', async function () {
      // The `runtime.sendMessage` API rejects if the target addon
      // is not installed. Simulate the same behaviour here, see
      // the docs:
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
      chrome.runtime.sendMessage.yields(
        Promise.reject(new Error("No addon makes this API reject")));

      assert.rejects(
        this.rally._checkRallyCore(),
        {message: "Rally._checkRallyCore - core addon not found"}
      );
    });

    it('must succeede if the core addon is installed', async function () {
      chrome.runtime.sendMessage.yields(
        {type: "core-check-response", data: {enrolled: true}});

      await this.rally._checkRallyCore();
    });
  });

  describe('sendPing()', function () {
    it('must not send data if not initialized', async function () {
      chrome.runtime.sendMessage.flush();

      // This API should never throw. We catch errors and
      // log them, but we have no way to assert that something
      // was logged. We can only assert that no message was
      // sent.
      await this.rally.sendPing("test", {});

      assert.ok(chrome.runtime.sendMessage.notCalled);
    });

    it('must not send data in developer mode', async function () {
      chrome.runtime.sendMessage.flush();
      // Make sure the core add-on is detected. This test
      // would work even if it wasn't detected, as long as
      // `_checkRallyCore` returns something.
      this.rally._checkRallyCore = async () => {
        return {
          "type": "core-check-response",
          "data": {
            "enrolled": true
          }
        };
      };

      await this.rally.initialize(
        "key-id",
        {},
        true, // Developer mode.
      );

      // This API should never throw. We catch errors and
      // log them, but we have no way to assert that something
      // was logged. We can only assert that no message was
      // sent.
      await this.rally.sendPing("test", {});

      assert.ok(chrome.runtime.sendMessage.notCalled);
    });
  });

  afterEach(function () {
    delete global.fetch;
    chrome.flush();
  });
});
