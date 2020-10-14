/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var sinon = require('sinon');

var IonCore = require('../../core-addon/IonCore');

describe('IonCore', function () {
  // A fake study id to use in the tests when looking for a
  // "known" study.
  FAKE_STUDY_ID = "test@ion-studies.com";
  FAKE_STUDY_ID_NOT_INSTALLED = "test-not-installed@ion-studies.com";
  FAKE_STUDY_LIST = [
    {
      "addon_id": FAKE_STUDY_ID
    },
    {
      "addon_id": FAKE_STUDY_ID_NOT_INSTALLED
    }
  ];

  beforeEach(function () {
    // Force the sinon-chrome stubbed API to resolve its promise
    // in tests. Without the next two lines, tests querying the
    // `browser.management.getAll` API will be stuck and timeout.
    // Note that this will fake our data to make FAKE_STUDY_ID look
    // installed.
    chrome.management.getAll
      .callsArgWith(0, [{type: "extension", id: FAKE_STUDY_ID}])
      .resolves();
    chrome.management.getAll.yields(
      [{type: "extension", id: FAKE_STUDY_ID}]);

    // NodeJS doesn't support "fetch" so we need to mock it
    // manually (or use a third party package). This isn't too
    // bad, as we can just return our fake ids.
    global.fetch = () => Promise.resolve({
      json() {
        return {
          "data": FAKE_STUDY_LIST
        }
      }
    });

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

    it('listens for addon state changes', function () {
      this.ionCore.initialize();
      assert.ok(chrome.management.onInstalled.addListener.calledOnce);
      assert.ok(chrome.management.onUninstalled.addListener.calledOnce);
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
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.firefoxPrivilegedApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");
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
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.firefoxPrivilegedApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).resolves();
      chrome.storage.local.get.yields({});

      // Provide a valid study enrollment message.
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
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        clearIonID: async function() {},
        submitEncryptedPing: async function(type, payload, options) {},
      };
      let telemetryMock = sinon.mock(chrome.firefoxPrivilegedApi);
      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      browser.storage.local.remove.yields();
      chrome.runtime.sendMessage.yields();

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
      // We also expect an "uninstall" message to be dispatched to
      // the one study marked as installed.
      assert.ok(
        chrome.runtime.sendMessage.withArgs(
          FAKE_STUDY_ID,
          sinon.match({type: "uninstall", data: {}}),
          // We're not providing any option.
          {},
          // This is the callback hidden away by webextension-polyfill.
          sinon.match.any
        ).calledOnce
      );
    });
  });

  describe('_enrollStudy()', function () {
    it('rejects unknown study ids', function () {
      assert.rejects(
        this.ionCore._enrollStudy("unknown-test-study-id@ion.com"),
        { message: "IonCore._enrollStudy - Unknown study unknown-test-study-id@ion.com"}
      );
    });
  });

  describe('_fetchAvailableStudies()', function () {
    it('returns a list of addons', async function () {
      let studies = await this.ionCore._fetchAvailableStudies();
      assert.equal(studies.length, 2);
      assert.ok(studies.filter(a => (a.addon_id === FAKE_STUDY_ID)));
      assert.ok(studies.filter(a => (a.addon_id === FAKE_STUDY_ID_NOT_INSTALLED)));
    });

    it('returns an empty list on errors', async function () {
      // Mock the 'fetch' to reject.
      global.fetch = () => Promise.reject();
      let studies = await this.ionCore._fetchAvailableStudies();
      assert.equal(studies.length, 0);
    });
  });

  describe('runUpdateInstalledStudiesTask()', function () {
    it('adds the ionInstalled property', async function () {
      // We don't expect any update task to be running now.
      assert.equal(this.ionCore._updateInstalledTask, null);
      // Kick off an update task.
      let studies =
        await this.ionCore.runUpdateInstalledStudiesTask(FAKE_STUDY_LIST);
      assert.equal(studies.length, 2);
      // Check that the FAKE_STUDY_ID is marked as installed (as per
      // our fake data, see the beginning of this file).
      assert.equal(studies
        .filter(a => (a.addon_id === FAKE_STUDY_ID))
        .map(a => a.ionInstalled)[0],
        true);
      // Check that the FAKE_STUDY_ID_NOT_INSTALLED is marked as
      // NOT installed.
      assert.equal(studies
        .filter(a => (a.addon_id === FAKE_STUDY_ID_NOT_INSTALLED))
        .map(a => a.ionInstalled)[0],
        false);
    });
  });

  describe('_sendMessageToStudy()', function () {
    it('rejects on unknown message types', async function () {
      assert.rejects(
        this.ionCore._sendMessageToStudy(
          "unknown-test-study-id@ion.com", "uninstall", {}
        ),
        { message: "IonCore._sendMessageToStudy - \"unknown-test-study-id@ion.com\" is not a known Ion study"}
      );
    });

    it('rejects on target study ids', async function () {
      assert.rejects(
        this.ionCore._sendMessageToStudy(FAKE_STUDY_ID, "unknown-type-test", {}),
        { message: "IonCore._sendMessageToStudy - unexpected message \"unknown-type-test\" to study \"test@ion-studies.com\""}
      );
    });

    it('properly dispatches messages to studies', async function () {
      let TEST_PAYLOAD = { "someKey": "testValue" };

      // Make sure the function yields during tests!
      chrome.runtime.sendMessage.yields();

      let response =
        await this.ionCore._sendMessageToStudy(FAKE_STUDY_ID, "uninstall", TEST_PAYLOAD);

      assert.ok(
        chrome.runtime.sendMessage.withArgs(
          FAKE_STUDY_ID,
          sinon.match({type: "uninstall", data: TEST_PAYLOAD}),
          // We're not providing any option.
          {},
          // This is the callback hidden away by webextension-polyfill.
          sinon.match.any
        ).calledOnce
      );
    });
  });

  afterEach(function () {
    delete global.fetch;
    chrome.flush();
  });
});
