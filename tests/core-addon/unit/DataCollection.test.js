/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert').strict;
var sinon = require('sinon');

var DataCollection = require('../../../core-addon/DataCollection');

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
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid enrollment message.
      await this.dataCollection.sendEnrollmentPing("some-rally-id", undefined, "deletion-id");

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... a payload containing only the deletion ID ...
      assert.equal(Object.keys(submitArgs[1]).length, 1);
      assert.ok(Object.keys(submitArgs[1]).includes("deletionId"));
      assert.equal(submitArgs[1]["deletionId"], "deletion-id");
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, "pioneer-core");
      assert.equal(submitArgs[2].encryptionKeyId, "core");
      assert.equal(submitArgs[2].schemaName, "pioneer-enrollment");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-core");
    });

    it('generates the correct ping for the study', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid study enrollment message.
      await this.dataCollection.sendEnrollmentPing("some-rally-id", FAKE_STUDY_ID);

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, FAKE_STUDY_ID);
      assert.equal(submitArgs[2].encryptionKeyId, "discarded");
      assert.equal(submitArgs[2].schemaName, "pioneer-enrollment");
      assert.equal(submitArgs[2].schemaNamespace, FAKE_STUDY_ID);
    });
  });

  describe('sendDeletionPing()', function () {
    it('rejects if no study id is provided', function () {
      assert.rejects(
        this.dataCollection.sendDeletionPing("some-rally-id"),
        { message: "DataCollection - the deletion-request ping requires a study id"}
      );
    });

    it('generates the deletion ping for the study', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Provide a valid study enrollment message.
      await this.dataCollection.sendDeletionPing("some-rally-id", FAKE_STUDY_ID);

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, FAKE_STUDY_ID);
      assert.equal(submitArgs[2].encryptionKeyId, "discarded");
      assert.equal(submitArgs[2].schemaName, "deletion-request");
      assert.equal(submitArgs[2].schemaNamespace, FAKE_STUDY_ID);
    });
  });

  describe('sendDemographicSurveyPing()', function () {
    it('generates an empty demographic-survey ping for the platform', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Since no option is mandatory, try to send an empty payload.
      await this.dataCollection.sendDemographicSurveyPing("some-rally-id", {});

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, "pioneer-core");
      assert.equal(submitArgs[2].encryptionKeyId, "core");
      assert.equal(submitArgs[2].schemaName, "demographic-survey");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-core");
    });

    it('submits demographic-survey ping if unknown keys are provided', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Attempt to send some unexpected data: the collection mechanism
      // should filter them out.
      await this.dataCollection.sendDemographicSurveyPing("some-rally-id", {
        "thisIsNotKnowAndNotExpected": ["wow"]
      });

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... an empty payload ...
      assert.equal(Object.keys(submitArgs[1]).length, 0);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, "pioneer-core");
      assert.equal(submitArgs[2].encryptionKeyId, "core");
      assert.equal(submitArgs[2].schemaName, "demographic-survey");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-core");
    });

    it('submits demographic-survey ping with partial data', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Only send one value.
      await this.dataCollection.sendDemographicSurveyPing("some-rally-id", {
        "age": "35_44",
      });

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... with the "age" data ...
      assert.equal(Object.keys(submitArgs[1]).length, 1);
      assert.ok("age" in submitArgs[1]);
      assert.equal(true, submitArgs[1]["age"]["35_44"]);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, "pioneer-core");
      assert.equal(submitArgs[2].encryptionKeyId, "core");
      assert.equal(submitArgs[2].schemaName, "demographic-survey");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-core");
    });

    it('submits demographic-survey ping with races and zip data', async function () {
      // Create a mock for the telemetry API.
      chrome.firefoxPrivilegedApi = {
        submitEncryptedPing: async function(type, payload, options) {},
      };

      // Use the spy to record the arguments of submitEncryptedPing.
      let telemetrySpy =
        sinon.spy(chrome.firefoxPrivilegedApi, "submitEncryptedPing");

      // Only send one value.
      await this.dataCollection.sendDemographicSurveyPing("some-rally-id", {
        "age": "35_44",
        "race": ["american_indian_or_alaska_native", "samoan"],
        "zipcode": "03295",
      });

      // We expect to submit a ping with the expected type ...
      const submitArgs = telemetrySpy.getCall(0).args;
      assert.equal(submitArgs[0], "pioneer-study");
      // ... with the "age", "races" and "zipcode" ...
      assert.equal(Object.keys(submitArgs[1]).length, 3);
      assert.ok("races" in submitArgs[1]);
      assert.equal(true, submitArgs[1]["races"]["american_indian_or_alaska_native"]);
      assert.equal(true, submitArgs[1]["races"]["samoan"]);
      assert.ok("zipCode" in submitArgs[1]);
      assert.equal("03295", submitArgs[1]["zipCode"]);
      // ... and a specific set of options.
      assert.equal(submitArgs[2].overridePioneerId, "some-rally-id");
      assert.equal(submitArgs[2].studyName, "pioneer-core");
      assert.equal(submitArgs[2].encryptionKeyId, "core");
      assert.equal(submitArgs[2].schemaName, "demographic-survey");
      assert.equal(submitArgs[2].schemaNamespace, "pioneer-core");
    });
  });

  afterEach(function () {
    chrome.flush();
  });
});
