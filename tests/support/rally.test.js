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

  afterEach(function () {
    delete global.fetch;
    chrome.flush();
  });
});
