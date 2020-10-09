/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var sinon = require('sinon');

var IonCore = require('../../core-addon/IonCore');

describe('IonCore', function () {
  beforeEach(function () {
    this.ionCore = new IonCore();
  });

  describe('_openControlPanel()', function () {
    it('should open the options page', function () {
      chrome.runtime.openOptionsPage.flush();
      this.ionCore._openControlPanel();
      assert.ok(chrome.runtime.openOptionsPage.calledOnce);
    });
  });

  describe('initialize()', function () {
    it('opens the options page on install', function () {
      chrome.runtime.openOptionsPage.flush();
      // The initializer installs the handlers.
      this.ionCore.initialize();
      // Dispatch an installation event to see if the page is
      // opened.
      chrome.runtime.onInstalled.dispatch({reason: "install"});
      assert.ok(chrome.runtime.openOptionsPage.calledOnce);
    });

    it('listens for clicks and messages', function () {
      this.ionCore.initialize();
      assert.ok(chrome.browserAction.onClicked.addListener.calledOnce);
      assert.ok(chrome.runtime.onMessage.addListener.calledOnce);
    });
  });

  describe('_handleMessage()', function () {
    it('rejects unknown messages', function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Provide an unknown message type and a valid origin:
      // it should fail due to the unexpected type.
      assert.rejects(
        this.ionCore._handleMessage(
          {type: "test-unknown-type", data: {}},
          {url: TEST_OPTIONS_URL}
        ),
        { message: "IonCore - unexpected message type test-unknown-type"}
      );
    });

    it('rejects unknown senders', function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Provide an unknown message type and a valid origin:
      // it should fail due to the unexpected type.
      assert.rejects(
        this.ionCore._handleMessage(
          {type: "enroll", data: {}},
          {url: "unkown-sender-url.html"}
        ),
        { message: "IonCore - received message from unexpected sender"}
      );
    });

    it('dispatchers enrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Create a mock for the telemetry API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.legacyTelemetryApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.legacyTelemetryApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.legacyTelemetryApi, "submitEncryptedPing");
      // Make sure to mock the local storage calls as well.
      chrome.storage.local.set.yields();

      // Provide a valid enrollment message.
      await this.ionCore._handleMessage(
        {type: "enrollment", data: {}},
        {url: TEST_OPTIONS_URL}
      );

      // We expect to store the fake ion ID...
      telemetryMock.expects("setIonID").withArgs([FAKE_UUID]).calledOnce;
      // ... to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].studyName, "pioneer-meta");
      assert.equal(submitArgs[2].encryptionKeyId, "discarded");
      assert.equal(submitArgs[2].schemaName, "pioneer-enrollment");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-meta");
    });

    it('dispatches study-enrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Create a mock for the telemetry API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.legacyTelemetryApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.legacyTelemetryApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.legacyTelemetryApi, "submitEncryptedPing");

      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).resolves();
      chrome.storage.local.get.yields({});

      // Provide a valid study enrollment message.
      const FAKE_STUDY_ID = "test@ion-studies.com";
      await this.ionCore._handleMessage(
        {type: "study-enrollment", data: { studyID: FAKE_STUDY_ID}},
        {url: TEST_OPTIONS_URL}
      );

      // We expect to store the fake ion ID...
      telemetryMock.expects("setIonID").withArgs([FAKE_UUID]).calledOnce;
      // ... to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].studyName, FAKE_STUDY_ID);
      assert.equal(submitArgs[2].encryptionKeyId, "discarded");
      assert.equal(submitArgs[2].schemaName, "pioneer-enrollment");
      assert.equal(submitArgs[2].schemaNamespace, FAKE_STUDY_ID);
    });

    it('dispatches unenrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Create a mock for the telemetry API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.legacyTelemetryApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        clearIonID: async function() {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.legacyTelemetryApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.legacyTelemetryApi, "submitEncryptedPing");

      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      const FAKE_STUDY_ID = "test@ion-studies.com";
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      browser.storage.local.remove.yields();

      // Provide a valid study enrollment message.
      await this.ionCore._handleMessage(
        {type: "unenrollment", data: {}},
        {url: TEST_OPTIONS_URL}
      );

      // We expect to store the fake ion ID...
      telemetryMock.expects("clearIonID").calledOnce;
      // ... to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].studyName, FAKE_STUDY_ID);
      assert.equal(submitArgs[2].encryptionKeyId, "discarded");
      assert.equal(submitArgs[2].schemaName, "deletion-request");
      assert.equal(submitArgs[2].schemaNamespace, FAKE_STUDY_ID);
    });
  });

  afterEach(function () {
    chrome.flush();
  });
});
