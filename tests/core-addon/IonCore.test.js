/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');

var IonCore = require('../../core-addon/IonCore');

describe('IonCore', function () {
  before(function () {
    this.ionCore = new IonCore();
  });

  describe('_openControlPanel()', function () {
    it('should open the options page', function () {
      browser.runtime.openOptionsPage.flush();
      this.ionCore._openControlPanel();
      assert.ok(browser.runtime.openOptionsPage.calledOnce);
    });
  });

  after(function () {
    browser.flush();
  });
});
