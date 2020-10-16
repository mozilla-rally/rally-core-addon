/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Storage = require("./Storage.js");
const DataCollection = require("./DataCollection.js");

// The path of the embedded resource used to control Ion options.
const ION_OPTIONS_PAGE_PATH = "public/index.html";

// NOTE: if this URL ever changes, you will have to update the domain in
// the permissions in manifest.json.
const ION_DEFAULT_ARGS = {
  availableStudiesURI: "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records"
}

module.exports = class IonCore {
   /**
  * @param {Object} args arguments passed in from the user.
  * @param {String} args.availablStudiesURI the URI where the available Ion studies 
  *             information is listed.
  */
  constructor(args = {}) {
    this._userArguments = {...ION_DEFAULT_ARGS, ...args};

    this._storage = new Storage();
    this._dataCollection = new DataCollection();
    // Keep track of the task updating the state of available
    // studies.
    this._updateInstalledTask = null;

    // Asynchronously get the available studies. We don't need to wait
    // for this to finish, the UI can handle the wait.
    this._availableStudies =
      this._fetchAvailableStudies()
          .then(studies => this.runUpdateInstalledStudiesTask(studies));
  }
  initialize() {
    // Whenever the addon icon is clicked, open the control page.
    browser.browserAction.onClicked.addListener(this._openControlPanel);
    // After installing the addon, make sure to show the control page.
    browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
      if (reason !== "install") {
        // We're only showing this when the addon is installed!
        return;
      }
      this._openControlPanel();
    });

    // Listen for messages from the options page.
    browser.runtime.onMessage.addListener(
      (m, s) => this._handleMessage(m, s));

    // Listen for addon install/uninstall and keep the studies
    // installation state up to date.
    let addonStateHandler = async () => {
      let studies = await this._availableStudies;
      // Update the studies list.
      this._availableStudies = this._availableStudies.then(
        studies => this.runUpdateInstalledStudiesTask(studies));
    };
    browser.management.onInstalled.addListener(addonStateHandler);
    browser.management.onUninstalled.addListener(addonStateHandler);

    // Listen for incoming messages from the studies.
    //
    // ***IMPORTANT***:
    //
    // `_handleExternalMessage` is async, even though
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
    // discourages that. The reason why it's discouraged is that by being async
    // the handler function would *always* return a Promise, telling the
    // WebExtensions framework that the message was handled, and thus preventing
    // other registered listeners to get the message. For our case, this is
    // not a problem, because:
    //
    //  - we always handle all the messages (always reject or resolve);
    //  - we only expect to have one listener (`_handleExternalMessage`).
    //
    // We want the handler to be async to conveniently handle all the
    // asynchronous calls and updates to the studies list.
    browser.runtime.onMessageExternal.addListener(this._handleExternalMessage);
  }

  _openControlPanel() {
    browser.runtime.openOptionsPage().catch(e => {
      console.error(`IonCore.js - Unable to open the control panel`, e);
    });
  }

  /**
   * Handles messages coming in from the options page.
   *
   * @param {Object} message
   *        The payload of the message.
   * @param {runtime.MessageSender} sender
   *        An object containing informations about who sent
   *        the message.
   * @returns {Promise} The response to the received message.
   *          It can be resolved with a value that is sent to the
   *          `sender`.
   */
  _handleMessage(message, sender) {
    // We only expect messages coming from the embedded options page
    // at this time. Discard anything else and report an error.
    if (sender.url != browser.runtime.getURL(ION_OPTIONS_PAGE_PATH)) {
      return Promise.reject(
        new Error("IonCore - received message from unexpected sender"));
    }

    switch (message.type) {
      case "enrollment": {
        // Let's not forget to respond `true` to the sender: the UI
        // is expecting it.
        return this._enroll().then(r => true);
      } break;
      case "get-studies": {
        return this._availableStudies;
      } break;
      case "study-enrollment": {
        // Let's not forget to respond `true` to the sender: the UI
        // is expecting it.
        return this._enrollStudy(message.data.studyID).then(r => true);
      } break;
      case "study-unenrollment": {
        // Let's not forget to respond `true` to the sender: the UI
        // is expecting it.
        return this._unenrollStudy(message.data.studyID).then(r => true);
      } break;
      case "unenrollment": {
        return this._unenroll().then(r => true);
      } break;
      default:
        return Promise.reject(
          new Error(`IonCore - unexpected message type ${message.type}`));
    }
  }

  /**
   * Handles messages coming in from studies.
   *
   * IMPORTANT: This is `async` and will always handle all the
   * external messages coming from the studies. It will not allow
   * any other registered listener to catch messages. See
   * the notes at the listener registration site.
   *
   * @param {Object} message
   *        The payload of the message.
   * @param {runtime.MessageSender} sender
   *        An object containing information about who sent
   *        the message.
   * @returns {Promise} The response to the received message.
   *          It can be resolved with a value that is sent to the
   *          `sender`.
   */
  async _handleExternalMessage(message, sender) {
    // We only expect messages coming from known ion studies.
    let knownStudies = await this._availableStudies;
    if (!knownStudies.map(s => s.addon_id).includes(sender.id)) {
      return Promise.reject(
        new Error(`IonCore._handleExternalMessage - unexpected sender ${sender.id}`));
    }

    switch (message.type) {
      case "telemetry-ping": {
        const {payloadType, payload, namespace, keyId, key} = message.data;
        return await this._dataCollection.sendPing(
          payloadType, payload, namespace, keyId, key
        );
      } break;
      default:
        return Promise.reject(
          new Error(`IonCore._handleExternalMessage - unexpected message type ${message.type}`));
    }
  }

  /**
   * Enroll in the Ion platform.
   *
   * This sets up all the required information (e.g. Ion ID)
   * and sets the relevant data to the pipeline.
   *
   * @returns {Promise} A promise resolved when the enrollment
   *          is complete (does not block on data upload).
   */
  async _enroll() {
    // Generate a proper random UUID.
    const uuid = await browser.firefoxPrivilegedApi.generateUUID();

    // Store it locally for future use.
    await this._storage.setIonID(uuid);

    // The telemetry API, before sending a ping, reads the
    // ion id from a pref. It no value is set, the API will
    // throw and nothing will be sent. This means, at enrollment,
    // we need set the value of that required pref.
    await browser.firefoxPrivilegedApi.setIonID(uuid);

    // Finally send the ping.
    await this._dataCollection.sendEnrollmentPing();
  }

  /**
   * Enroll in an Ion Study.
   *
   * This sends the required pings,
   *
   * @returns {Promise} A promise resolved when the enrollment
   *          is complete (does not block on data upload).
   */
  async _enrollStudy(studyAddonId) {
    // We only expect to enroll in known studies.
    let knownStudies = await this._availableStudies;
    if (!knownStudies.map(s => s.addon_id).includes(studyAddonId)) {
      return Promise.reject(
        new Error(`IonCore._enrollStudy - Unknown study ${studyAddonId}`));
    }

    // Record that user activated this study.
    await this._storage.appendActivatedStudy(studyAddonId);

    // Finally send the ping.
    await this._dataCollection.sendEnrollmentPing(studyAddonId);
  }

  /**
   * Unenroll in an Ion Study.
   *
   * This sends the required pings.
   *
   * @returns {Promise} A promise resolved when the unenrollment
   *          is complete (does not block on data upload).
   *          NOTE: this does NOT trigger the study add-on to
   *          uninstall itself at the moment.
   */
  async _unenrollStudy(studyAddonId) {
    // We only expect to unenroll in known studies.
    let knownStudies = await this._availableStudies;
    if (!knownStudies.map(s => s.addon_id).includes(studyAddonId)) {
      return Promise.reject(
        new Error(`IonCore._unenrollStudy - Unknown study ${studyAddonId}`));
    }

    // Attempt to send an uninstall message, but move on if the
    // delivery fails: studies will not be able to send anything
    // without the Ion Core anyway.
    try {
      await this._sendMessageToStudy(studyAddonId, "uninstall", {});
    } catch (e) {
      console.error(`IonCore._unenroll - Unable to uninstall ${studyAddonId}`, e);
    }

    await this._storage.removeActivatedStudy(studyAddonId);
    await this._dataCollection.sendDeletionPing(studyAddonId);
  }

  /**
   * Unenroll from the Ion platform.
   *
   * This clears all the stored data (e.g. Ion ID)
   * and sends the relevant deletion requests to the pipeline.
   *
   * @returns {Promise} A promise resolved when the unenrollment
   *          is complete (does not block on data upload).
   */
  async _unenroll() {
    // Uninstall all known studies that are still installed.
    let installedStudies = (await this._availableStudies)
      .filter(s => s.ionInstalled)
      .map(s => s.addon_id);
    for (let studyId of installedStudies) {
      // Attempt to send an uninstall message to each study, but
      // move on if the delivery fails: studies will not be able
      // to send anything without the Ion Core anyway.
      try {
        await this._sendMessageToStudy(studyId, "uninstall", {});
      } catch (e) {
        console.error(`IonCore._unenroll - Unable to uninstall ${studyId}`, e);
      }
    }

    // Read the list of the studies user activated throughout
    // their stay on the Ion platform and send a deletion request
    // for each of them.
    let studyList = await this._storage.getActivatedStudies();
    for (let studyId of studyList) {
      await this._dataCollection.sendDeletionPing(studyId);
    }

    // Clear locally stored Ion ID.
    await this._storage.clearIonID();

    // The telemetry API, before sending a ping, reads the
    // ion id from a pref. We're good to clear this after sending
    // the deletion pings.
    await browser.firefoxPrivilegedApi.clearIonID();

    // Finally clear the list of studies user took part in.
    await this._storage.clearActivatedStudies();
  }

  /**
   * Sends a message to an available Ion study.
   *
   * @param {String} studyId
   *        The id of the Ion study, as assigned by the platform
   *        it is deployed on (e.g. a Firefox Addon Id).
   * @param {String} type
   *        The type of the message to send. Check `VALID_TYPES`
   *        for a list of supported types.
   * @param {Object} payload
   *        A JSON-serializable object with the message payload.
   * @returns {Promise} resolved with the response from the study
   *          if the message was correctly sent, rejected otherwise.
   */
  async _sendMessageToStudy(studyId, type, payload) {
    const VALID_TYPES = [
      "uninstall",
    ];

    // Make sure `type` is one of the expected values.
    if (!VALID_TYPES.includes(type)) {
      return Promise.reject(
        new Error(`IonCore._sendMessageToStudy - unexpected message "${type}" to study "${studyId}"`));
    }

    // Validate the studyId against the list of known studies.
    let studyList = await this._storage.getActivatedStudies();
    if (!studyList.includes(studyId)) {
      return Promise.reject(
        new Error(`IonCore._sendMessageToStudy - "${studyId}" is not a known Ion study`));
    }

    const msg = {
      type,
      data: payload
    };

    return await browser.runtime.sendMessage(studyId, msg, {});
  }

  /**
   * An utility function to run a task for updating the status
   * of the available addons.
   *
   * Note that this is needed in order to prevent races between
   * multiple callers of this functions (e.g. init, addon install,
   * addon uninstall).
   *
   * @param {Array<Object>} studies
   *        An array containing objects describing Ion studies.
   * @returns {Promise(Array<Object>)} resolved with an array of studies
   *          objects, or an empty array on failures. Each study object
   *          has at least the `addon_id` and `ionInstalled` properties.
   */
  async runUpdateInstalledStudiesTask(studies) {
    // We're already updating the state of the studies.
    if (this._updateInstalledTask) {
      return this._updateInstalledTask;
    }

    // Make sure to clear |_updateInstalledTask| once done.
    let clear = studies => {
      this._updateInstalledTask = null;
      return studies;
    };
    // Since there's no archive cleaning task running, start it.
    this._updateInstalledTask =
      this._updateInstalledStudies(studies).then(clear, clear);
    return this._updateInstalledTask;
  }

  /**
   * Update the `ionInstalled` property for the available studies.
   *
   * @returns {Promise(Array<Object>)} resolved with an array of studies
   *          objects, or an empty array on failures. Each study object
   *          has at least the `addon_id` and `ionInstalled` properties.
   */
  async _updateInstalledStudies(studies) {
    console.debug("IonCore._updateInstalledStudies");

    // If we were able to fetch studies definitions, see if any
    // of them were installed. Start by getting the list of installed
    // addons.
    let installedAddonsIds =
      await browser.management.getAll().then(addons =>
        addons.filter(a => a.type == "extension")
              .map(a => a.id));
    return studies.map(s => {
      s.ionInstalled = installedAddonsIds.includes(s.addon_id);
      return s;
    });
  }

  /**
   * Fetch the available studies.
   *
   * This loads the studies from the Firefox Remote Settings service.
   *
   * @returns {Promise(Array<Object>)} resolved with an array of studies
   *          objects, or an empty array on failures.
   */
  async _fetchAvailableStudies() {
    try {
      const request = await fetch(this._userArguments.availableStudiesURI);
      return (await request.json()).data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
