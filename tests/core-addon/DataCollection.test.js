/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var sinon = require('sinon');

var DataCollection = require('../../core-addon/DataCollection');

// A fake study id to use in the tests when looking for a
// "known" study.
const FAKE_STUDY_ID = "test@ion-studies.com";

describe('DataCollection', function () {
  beforeEach(function () {
    this.dataCollection = new DataCollection();
  });

  describe('sendEnrollmentPing()', function () {
    it('generates the correct ping for the platform', async function () {
      // Create a mock for the privileged API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid enrollment message.
      await this.dataCollection.sendEnrollmentPing();

      // We expect to submit a ping with the expected type ...
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

    it('generates the correct ping for the study', async function () {
      // Create a mock for the telemetry API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid study enrollment message.
      await this.dataCollection.sendEnrollmentPing(FAKE_STUDY_ID);

      // We expect to submit a ping with the expected type ...
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
  });

  describe('sendDeletionPing()', function () {
    it('rejects if no study id is provided', function () {
      assert.rejects(
        this.dataCollection.sendDeletionPing(),
        { message: "IonCore - the deletion-request ping requires a study id"}
      );
    });

    it('generates the deletion ping for the study', async function () {
      // Create a mock for the telemetry API.
      const FAKE_UUID = "c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0";
      chrome.firefoxPrivilegedApi = {
        generateUUID: async function() { return FAKE_UUID; },
        setIonID: async function(uuid) {},
        clearIonID: async function() {},
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid study enrollment message.
      await this.dataCollection.sendDeletionPing(FAKE_STUDY_ID);

      // We expect to submit a ping with the expected type ...
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
