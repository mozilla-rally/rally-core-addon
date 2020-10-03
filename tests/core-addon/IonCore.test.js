/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const chrome = require('sinon-chrome/extensions');
var assert = require('assert');

var IonCore = require('../../core-addon/IonCore');

describe('IonCore', function () {
  before(function () {
    global.chrome = chrome;
    console.log(`IonCore is: ${typeof IonCore}`);
    this.ionCore = new IonCore();
  });

  describe('_openControlPanel()', function () {
    it('should open the options page', function () {
      chrome.runtime.openOptionsPage.flush();
      this.ionCore._openControlPanel();
      assert.ok(chrome.runtime.openOptionsPage.calledOnce);
    });
  });

  after(function () {
    chrome.flush();
    delete global.chrome;
  });
});
