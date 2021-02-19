/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';

import Rally from '../../support/rally.js';

describe('Rally', function () {
  beforeEach(function () {
    this.rally = new Rally();
  });

  describe('initialize()', function () {
    it('must fail with invalid keys', function () {
      assert.rejects(
        this.rally.initialize("key-id", "not-an-object, will fail", true, () => {})
      );
    });

    it('must fail with an invalid callback function', function () {
      assert.rejects(
        this.rally.initialize("key-id", {}, true, "not-a-function, will fail")
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
        () => {},
      );

      assert.ok(browser.tabs.create.notCalled);
    });

    it('no core addon rejects init and opens signup', async function () {
      chrome.tabs.create.yields();

      // Mock the check to make it fail.
      this.rally._checkRallyCore = async () => {
        throw "Core Add-On not available.";
      };

      await assert.rejects(
        this.rally.initialize(
          "key-id",
          {},
          false,
          () => {},
        )
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

    it('must succeed if the core addon is installed', async function () {
      chrome.runtime.sendMessage.yields(
        {type: "core-check-response", data: {enrolled: true}});

      await this.rally._checkRallyCore();
    });
  });

  describe('_pause()', function () {
    it('pauses when receiving message', async function() {
      chrome.runtime.sendMessage.flush();
      chrome.runtime.sendMessage.yields();

      let callbackCalled = false;
      await this.rally.initialize(
        "key-id",
        {},
        true, // Developer mode.
        (message) => {
          callbackCalled = true;
          assert.equal(message, "pause");
        },
      )

      this.rally._state = "running";
      this.rally._handleExternalMessage({ type: "pause" }, { id: "rally-core@mozilla.org" });

      assert.equal(this.rally._state, "paused");
      assert.ok(callbackCalled);
    });
  });

  describe('_resume()', function () {
    it('resumes when receiving message', async function () {
      chrome.runtime.sendMessage.flush();
      chrome.runtime.sendMessage.yields();

      let callbackCalled = false;
      await this.rally.initialize(
        "key-id",
        {},
        true, // Developer mode.
        (message) => {
          callbackCalled = true;
          assert.equal(message, "resume");
        },
      )

      this.rally._state = "paused";
      this.rally._handleExternalMessage({ type: "resume" }, { id: "rally-core@mozilla.org" });

      assert.equal(this.rally._state, "running");
      assert.ok(callbackCalled);
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
        () => {},
      );

      // This API should never throw. We catch errors and
      // log them, but we have no way to assert that something
      // was logged. We can only assert that no message was
      // sent.
      await this.rally.sendPing("test", {});

      assert.ok(chrome.runtime.sendMessage.notCalled);
    });

    it('must not send data when paused', async function () {
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
        true, // Non-developer mode.
        () => {},
      );

      this.rally._state = "running";
      await this.rally.sendPing("test running", {});
      assert.ok(chrome.runtime.sendMessage.notCalled);

      this.rally._state = "paused";
      await this.rally.sendPing("test running", {});
      assert.ok(chrome.runtime.sendMessage.notCalled);

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
