/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';
// eslint-disable-next-line  node/no-extraneous-import
import sinon from 'sinon';

import Glean from "@mozilla/glean/webext";

import Core from '../../../core-addon/Core.js';
import * as rallyMetrics from "../../../public/generated/rally.js";
import * as enrollmentMetrics from "../../../public/generated/enrollment.js";
import * as rallyPings from "../../../public/generated/pings.js";


// The website to post deletion IDs to.
const OFFBOARD_URL = "https://production.rally.mozilla.org/offboard";

// A fake study id to use in the tests when looking for a
// "known" study.
const FAKE_STUDY_ID = "test@ion-studies.com";
const FAKE_STUDY_ID_NOT_INSTALLED = "test-not-installed@ion-studies.com";
const FAKE_STUDY_LIST = [
  {
    "addonId": FAKE_STUDY_ID
  },
  {
    "addonId": FAKE_STUDY_ID_NOT_INSTALLED
  }
];
const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
const FAKE_WEBSITE = "https://test.website";

describe('Core', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const testAppId = `core.test.${this.title}`;

  beforeEach(async function() {
    await Glean.testResetGlean(testAppId);

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
    browser.storage.local.get
      .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
      .resolves();
    chrome.runtime.sendMessage.yields();
    chrome.runtime.getManifest.returns({version: "1.2.3"});

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

    // Create a mock for the privileged API.
    chrome.firefoxPrivilegedApi = {
      generateUUID: async function() { return FAKE_UUID; },
      submitEncryptedPing: async function(type, payload, options) {},
      getRemoteSettings: async () => FAKE_STUDY_LIST,
      onRemoteSettingsSync: {
        addListener: async (callback) => {
          callback(FAKE_STUDY_LIST);
        }
      },
    };

    this.core = new Core({
      website: FAKE_WEBSITE
    });

    // Mock the channel to the UI.
    this.core._connectionPort = {
      postMessage: async () => Promise.resolve(),
    };
  });

  describe('_openControlPanel()', function () {
    it('should open the options page', function () {
      chrome.runtime.openOptionsPage.flush();
      this.core._openControlPanel();
      assert.ok(chrome.runtime.openOptionsPage.calledOnce);
    });
  });

  describe('initialize()', function () {
    it('opens the options page on install', function () {
      chrome.runtime.openOptionsPage.flush();
      // The initializer installs the handlers.
      this.core.initialize();
      // Dispatch an installation event to see if the page is
      // opened.
      chrome.runtime.onInstalled.dispatch({reason: "install"});
      assert.ok(chrome.runtime.openOptionsPage.calledOnce);
    });

    it('listens for clicks and messages', function () {
      this.core.initialize();
      assert.ok(chrome.browserAction.onClicked.addListener.calledOnce);
      assert.ok(chrome.runtime.onConnect.addListener.calledOnce);
    });

    it('sets a redirecting URL in case the user uninstalls Rally', async function () {
      await this.core.setUninstallURL();
      assert.ok(chrome.runtime.setUninstallURL.withArgs(`__BASE_SITE__/leaving-rally`).calledOnce);
    });

    it('sets an URL with the deletionID after enrollment and restart, in case the user uninstalls Rally', async function () {
      const FAKE_RALLY_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      const FAKE_DELETION_UUID = "deadbeef-ffee-c0ff-eec0-ffeec0ffeec0";

      this.core._storage = {
        getRallyID: async function() { return FAKE_RALLY_UUID; },
        getDeletionID: async function() { return FAKE_DELETION_UUID; },
      };

      await this.core.setUninstallURL();
      assert.ok(chrome.runtime.setUninstallURL.withArgs(`${OFFBOARD_URL}?id=${FAKE_DELETION_UUID}`).calledOnce);
    });

    it('listens for addon state changes', function () {
      this.core.initialize();
      assert.ok(chrome.management.onInstalled.addListener.calledOnce);
      assert.ok(chrome.management.onUninstalled.addListener.calledOnce);
    });
  });

  describe('_onPortConnected()', function () {
    it('rejects unknown sender addon', function () {
      let fakePort = {
         sender: {
          id: "unknown-addon",
         },
         disconnect: sinon.spy(),
      };

      // Provide an unknown message type and a valid origin:
      // it should fail due to the unexpected type.
      this.core._onPortConnected(fakePort);

      assert.ok(fakePort.disconnect.calledOnce);
    });

    it('rejects unknown sender url', function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      let fakePort = {
         sender: {
          id: FAKE_STUDY_ID,
          url: "unknown-url.html"
         },
         disconnect: sinon.spy(),
      };

      // Provide an unknown message type and a valid origin:
      // it should fail due to the unexpected type.
      this.core._onPortConnected(fakePort);

      assert.ok(fakePort.disconnect.calledOnce);
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
        this.core._handleMessage(
          {type: "test-unknown-type", data: {}}
        ),
        { message: "Core - unexpected message type test-unknown-type"}
      );
    });

    it('dispatches enrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      // Return an empty object from the local storage. Note that this
      // needs to use `browser` and must use `callsArgWith` to guarantee
      // that the promise resolves, due to a bug in sinon-chrome. See
      // acvetkov/sinon-chrome#101 and acvetkov/sinon-chrome#106.
      browser.storage.local.get.callsArgWith(1, {}).resolves();
      // Make sure to mock the local storage calls as well.
      browser.storage.local.set.yields();

      // Do not wait on this._availableStudies
      this.core._sendStateUpdateToUI = async () => {};

      sinon.spy(this.core._dataCollection, "sendEnrollmentPing");
      sinon.spy(this.core._storage, "setRallyID");
      const enrollmentPingSpy = sinon.spy(rallyPings.enrollment, "submit");

      // Provide a valid enrollment message.
      await this.core._handleMessage(
        {type: "enrollment", data: {}}
      );

      assert.equal(await rallyMetrics.id.testGetValue("enrollment"), FAKE_UUID);

      // We expect to store the fake ion ID.
      assert.ok(this.core._storage.setRallyID.withArgs(FAKE_UUID).calledOnce);
      assert.ok(this.core._dataCollection.sendEnrollmentPing.calledOnce);
      assert.ok(enrollmentPingSpy.calledOnce);
    });

    it('dispatches study-enrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      sinon.spy(this.core._dataCollection, "sendEnrollmentPing");
      const enrollmentPingMock = sinon.mock(rallyPings.studyEnrollment);
      enrollmentPingMock.expects("submit").once();

      // Mock the storage to provide a fake rally id.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      browser.storage.local.get
        .callsArgWith(1, {rallyId: FAKE_UUID})
        .resolves();
      chrome.storage.local.get.yields(FAKE_UUID);

      // Attempt to enroll to a study.
      await this.core._enrollStudy(FAKE_STUDY_ID);

      assert.equal(await enrollmentMetrics.studyId.testGetValue("study-enrollment"), FAKE_STUDY_ID);

      // We expect to store the fake ion ID.
      assert.ok(
        this.core._dataCollection.sendEnrollmentPing.withArgs(FAKE_UUID, FAKE_STUDY_ID).calledOnce
      );
      enrollmentPingMock.verify();
    });

    it('dispatches unenrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      this.core._storage = {
        getActivatedStudies: async function() { return [FAKE_STUDY_ID]; },
        clearActivatedStudies: async function() {},
        getRallyID: async function() { return FAKE_UUID; },
        clearRallyID: async function() {},
        clearDeletionID: async function() {},
      };

      sinon.spy(this.core._dataCollection, "sendDeletionPing");
      sinon.spy(this.core._storage, "clearRallyID");
      sinon.spy(this.core._storage, "clearDeletionID");

      chrome.runtime.sendMessage.yields();
      browser.management.uninstallSelf.yields();

      // Provide a valid study enrollment message.
      await this.core._handleMessage(
        {type: "unenrollment", data: {}}
      );

      // We expect to remove the fake rally and deletion IDs...
      assert.ok(this.core._storage.clearRallyID.calledOnce);
      assert.ok(this.core._storage.clearDeletionID.calledOnce);
      // ... to submit a ping with the expected type ...
      assert.ok(
        this.core._dataCollection.sendDeletionPing.withArgs(FAKE_UUID, FAKE_STUDY_ID).calledOnce
      );
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
      // We expect the core addon to uninstall itself.
      assert.ok(browser.management.uninstallSelf.calledOnce);
    });

    it('dispatches first-run-completion message', async function () {
      sinon.spy(this.core._storage, "setFirstRunCompletion");

      await this.core._handleMessage({
        type: "first-run-completion", data: {firstRunCompleted: true}
      });

      assert.ok(this.core._storage.setFirstRunCompletion.calledOnce);
    });

    it('dispatches study-unenrollment messages', async function () {
      // Mock the URL of the options page.
      const TEST_OPTIONS_URL = "install.sample.html";
      chrome.runtime.getURL.returns(TEST_OPTIONS_URL);

      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      this.core._storage = {
        getActivatedStudies: async function() { return [FAKE_STUDY_ID]; },
        removeActivatedStudy: async function() {},
        getRallyID: async function() { return FAKE_UUID; },
      };

      sinon.spy(this.core._dataCollection, "sendDeletionPing");

      chrome.runtime.sendMessage.yields();

      // Provide a valid study unenrollment message.
      await this.core._handleMessage(
        {type: "study-unenrollment", data: { studyID: FAKE_STUDY_ID}}
      );

      // We to submit a ping with the expected type.
      assert.ok(
        this.core._dataCollection.sendDeletionPing.withArgs(FAKE_UUID, FAKE_STUDY_ID).calledOnce
      );

      // Make sure that we're generating an uninstall message for
      // this study.
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

  describe('_handleExternalMessage()', function () {
    it('rejects unknown messages', function () {
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();

      // Provide an unknown message type and a valid sender:
      // it should fail due to the unexpected type.
      assert.rejects(
        this.core._handleExternalMessage(
          {type: "test-unknown-type", data: {}},
          {id: FAKE_STUDY_ID}
        ),
        { message: "Core._handleExternalMessage - unexpected message type test-unknown-type"}
      );
    });

    it('rejects unknown senders', function () {
      assert.rejects(
        this.core._handleExternalMessage(
          {type: "irrelevant-as-fails-earlier", data: {}},
          {id: "unknown-test-study-id"}
        ),
        { message: "Core._handleExternalMessage - unexpected sender unknown-test-study-id"}
      );
    });

    it('dispatches telemetry-ping messages', async function () {
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      this.core._storage = {
        getActivatedStudies: async function() { return [FAKE_STUDY_ID]; },
        getRallyID: async function() { return FAKE_UUID; },
      };

      sinon.spy(this.core._dataCollection, "sendPing");

      const SENT_PING = {
        payloadType: "test-telemetry-ping",
        payload: {
          testData: 37
        },
        namespace: "test-namespace",
        keyId: "some-id",
        key: {
          kty:"EC",
          crv:"P-256",
          x:"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
          y:"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
          kid:"Public key used in JWS spec Appendix A.3 example"
        }
      };

      // Provide a valid study enrollment message.
      await this.core._handleExternalMessage(
        {type: "telemetry-ping", data: SENT_PING},
        {id: FAKE_STUDY_ID}
      );

      assert.ok(
        this.core._dataCollection.sendPing
            .withArgs(
              FAKE_UUID,
              SENT_PING.payloadType,
              sinon.match(SENT_PING.payload),
              SENT_PING.namespace,
              SENT_PING.keyId,
              sinon.match(SENT_PING.key)
            ).calledOnce
      );
    });

    it('do not process telemetry-ping unless study is joined', async function () {
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      this.core._storage = {
        // Intentionally return an empty list here so that no
        // study is marked as joined.
        getActivatedStudies: async function() { return []; },
        getRallyID: async function() { return FAKE_UUID; },
      };

      // Provide a valid study enrollment message.
      assert.rejects(
        this.core._handleExternalMessage(
          {type: "telemetry-ping", data: {}},
          {id: FAKE_STUDY_ID}
        ),
        { message: "Core._handleExternalMessage - test@ion-studies.com not joined"}
      );
    });
  });

  describe('_handleWebMessage()', function () {
    it('rejects unknown websites', function () {
      assert.rejects(
        this.core._handleWebMessage({}, {url: "https://unknown.example.com"}),
        { message: "Core - received message from unexpected URL https://unknown.example.com"}
      );
    });

    it('rejects unknown addon ids', function () {
      assert.rejects(
        this.core._handleWebMessage({}, {url: FAKE_WEBSITE, id: "unknown-test-id"}),
        { message: "Core - received message from an unexpected webextension unknown-test-id"}
      );
    });

    it('rejects unknown messages', function () {
      browser.runtime.id = "testid";
      assert.rejects(
        this.core._handleWebMessage({type: "well, not known"}, {url: FAKE_WEBSITE, id: "testid"}),
        { message: `Core._handleWebMessage - unexpected message type "well, not known"`}
      );
    });
  });

  describe('_enrollStudy()', function () {
    it('rejects unknown study ids', function () {
      assert.rejects(
        this.core._enrollStudy("unknown-test-study-id@ion.com"),
        { message: "Core._enrollStudy - Unknown study unknown-test-study-id@ion.com"}
      );
    });
  });

  describe('_fetchAvailableStudies()', function () {
    it('returns a list of addons', async function () {
      let studies = await this.core._fetchAvailableStudies();
      assert.equal(studies.length, 2);
      assert.ok(studies.filter(a => (a.addonId === FAKE_STUDY_ID)));
      assert.ok(studies.filter(a => (a.addonId === FAKE_STUDY_ID_NOT_INSTALLED)));
    });

    it('returns an empty list on errors', async function () {
      // Create a mock for the privileged API.
      chrome.firefoxPrivilegedApi = {
        getRemoteSettings: async () => [],
      };

      let studies = await this.core._fetchAvailableStudies();
      assert.equal(studies.length, 0);
    });

  });
  describe('_updateInstalledStudies()', function () {
    it('adds the studyInstalled property', async function () {
      // Kick off an update task.
      let studies =
        await this.core._updateInstalledStudies(FAKE_STUDY_LIST);
      assert.equal(studies.length, 2);
      // Check that the FAKE_STUDY_ID is marked as installed (as per
      // our fake data, see the beginning of this file).
      assert.equal(studies
        .filter(a => (a.addonId === FAKE_STUDY_ID))
        .map(a => a.studyInstalled)[0],
        true);
      // Check that the FAKE_STUDY_ID_NOT_INSTALLED is marked as
      // NOT installed.
      assert.equal(studies
        .filter(a => (a.addonId === FAKE_STUDY_ID_NOT_INSTALLED))
        .map(a => a.studyInstalled)[0],
        false);
    });
  });

  describe('_sendMessageToStudy()', function () {
    it('rejects on unknown studies', async function () {
      chrome.runtime.sendMessage.flush();
      assert.rejects(
        this.core._sendMessageToStudy(
          "unknown-test-study-id@ion.com", "uninstall", {}
        ),
        { message: "Core._sendMessageToStudy - \"unknown-test-study-id@ion.com\" is not a known study"}
      );
    });

    it('rejects on target study ids', async function () {
      assert.rejects(
        this.core._sendMessageToStudy(FAKE_STUDY_ID, "unknown-type-test", {}),
        { message: "Core._sendMessageToStudy - unexpected message \"unknown-type-test\" to study \"test@ion-studies.com\""}
      );
    });

    it('properly dispatches messages to studies', async function () {
      let TEST_PAYLOAD = { "someKey": "testValue" };

      // Make sure the functions yield during tests!
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      chrome.runtime.sendMessage.yields();

      await this.core._sendMessageToStudy(FAKE_STUDY_ID, "uninstall", TEST_PAYLOAD);

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

  describe('_updateDemographics()', function () {
    it('properly saves data to the local storage', async function () {
      let TEST_SURVEY_DATA = { "someKey": "testValue" };

      // Set a fake Rally id.
      browser.storage.local.get
        .callsArgWith(1, {rallyId: "fake-rally-id"})
        .resolves();

      await this.core._updateDemographics(TEST_SURVEY_DATA);

      assert.ok(
        browser.storage.local.set.withArgs(
          sinon.match({"demographicsData": TEST_SURVEY_DATA})
        ).calledOnce
      );
    });
  });

  describe('_sendRunState', function() {
    it('resumes studies properly', async function () {
      chrome.runtime.sendMessage.flush();
      // Make sure the functions yield during tests!
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      chrome.runtime.sendMessage.yields();

      await this.core._sendRunState(FAKE_STUDY_LIST, [FAKE_STUDY_ID]);

      assert.ok(
        chrome.runtime.sendMessage.withArgs(
          FAKE_STUDY_ID,
          sinon.match({type: "resume", data: {}}),
          // We're not providing any option.
          {},
          // This is the callback hidden away by webextension-polyfill.
          sinon.match.any
        ).calledOnce
      );
    });

    it('pauses studies properly', async function () {
      // Make sure the functions yield during tests!
      browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      chrome.runtime.sendMessage.yields();

      const fakeStudy = FAKE_STUDY_LIST[0];
      fakeStudy.studyPaused = true;
      await this.core._sendRunState(FAKE_STUDY_LIST, [FAKE_STUDY_ID]);

      assert.ok(
        chrome.runtime.sendMessage.withArgs(
          FAKE_STUDY_ID,
          sinon.match({type: "pause", data: {}}),
          // We're not providing any option.
          {},
          // This is the callback hidden away by webextension-polyfill.
          sinon.match.any
        ).calledOnce
      );
    });

    it('may not send telemetry when paused', async function () {
     // Make sure the functions yield during tests!
     browser.storage.local.get
        .callsArgWith(1, {activatedStudies: [FAKE_STUDY_ID]})
        .resolves();
      chrome.runtime.sendMessage.yields();

      const fakeStudy = FAKE_STUDY_LIST[0];
      fakeStudy.studyPaused = true;
      await this.core._sendRunState(FAKE_STUDY_LIST, [FAKE_STUDY_ID]);

      sinon.spy(this.core._dataCollection, "sendPing");

      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      this.core._storage = {
        getActivatedStudies: async function() { return [FAKE_STUDY_ID]; },
        getRallyID: async function() { return FAKE_UUID; },
      };

      const SENT_PING = {
        payloadType: "test-telemetry-ping",
        payload: {
          testData: 38
        },
        namespace: "test-namespace",
        keyId: "some-id",
        key: {
          kty:"EC",
          crv:"P-256",
          x:"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
          y:"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
          kid:"Public key used in JWS spec Appendix A.3 example"
        }
      };

      // Provide a valid study ping message.
      assert.rejects(
        this.core._handleExternalMessage(
          {type: "telemetry-ping", data: SENT_PING},
          {id: FAKE_STUDY_ID}
        ),
        { message: "Core._handleExternalMessage - test@ion-studies.com is paused and may not send data"}
      );

      assert.ok(
        this.core._dataCollection.sendPing
            .withArgs(
              FAKE_UUID,
              SENT_PING.payloadType,
              sinon.match(SENT_PING.payload),
              SENT_PING.namespace,
              SENT_PING.keyId,
              sinon.match(SENT_PING.key)
            ).notCalled
      );
    });
  });

  afterEach(function () {
    delete global.fetch;
    chrome.flush();
  });
});
