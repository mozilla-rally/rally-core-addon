// return Promises to make API compatible with async implementations
export default {
  async initialize(key) {
    // returns the last saved app state.
    if (localStorage.getItem(key) === null) {
      return undefined;
    }
    return this.getItem(key);
  },
  async getAvailableStudies() {
    // this API function will return the available studies from a remote source.
    // use it when instantiating or updating the app store.
    return Promise.resolve(availableStudies);
  },
  async getIonEnrollment() {
    // this API function will return Ion enrollment status from a remote source.
    // use it primarily when instantiating or updating the app store.
    const state = await this.getItem("__STATE__");
    if (state !== null) {
      return JSON.parse(state).isEnrolled || false;
    } else {
      return false;
    }
  },
  async getItem(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  async setItem(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },
  async updateStudyEnrollment(studyID, enroll) {
    // this updates the study enrollment in whatever remote location
    // we might need to keep track of that.
    return true;
  },
  async updateIonEnrollment(enroll) {
    // this updates the ion enrollment in whatever remote location we have.
    return true;
  },
};

const availableStudies = [
  {
    name: "Demo Study",
    icons: {
      32: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-32.png?modified=4a64e2bc",
      64: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-64.png?modified=4a64e2bc",
      128: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-128.png?modified=4a64e2bc",
    },
    schema: 1597266497978,
    authors: {
      url: "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
      name: "Pioneer Developers",
    },
    version: "1.0",
    addon_id: "pioneer-v2-example@mozilla.org",
    moreInfo: {
      spec:
        "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
    },
    isDefault: false,
    sourceURI: {
      spec:
        "https://addons.mozilla.org/firefox/downloads/file/3579857/pioneer_v2-1.0-fx.xpi",
    },
    studyType: "extension",
    studyEnded: false,
    description: "Study purpose: Testing Pioneer.",
    privacyPolicy: {
      spec:
        "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
    },
    joinStudyConsent:
      "This study will send an encrypted ping, only when the toolbar icon is clicked.",
    leaveStudyConsent: "This study cannot be re-joined.",
    dataCollectionDetails: ["The date and time"],
  },
  {
    name: "How The Web Works",
    icons: {
      32: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-32.png?modified=4a64e2bc",
      64: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-64.png?modified=4a64e2bc",
      128: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-128.png?modified=4a64e2bc",
    },
    schema: 1597266497978,
    authors: {
      url: "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
      name: "Mozilla Foundation",
    },
    version: "1.0",
    addon_id: "mofo-demo-study@mozilla.org",
    moreInfo: {
      spec:
        "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
    },
    isDefault: false,
    sourceURI: {
      spec:
        "https://addons.mozilla.org/firefox/downloads/file/3579857/pioneer_v2-1.0-fx.xpi",
    },
    studyType: "extension",
    studyEnded: false,
    description: "This study helps Mozilla understand how the web works.",
    privacyPolicy: {
      spec:
        "https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
    },
    joinStudyConsent:
      "This study will send an encrypted ping, only when the toolbar icon is clicked.",
    leaveStudyConsent: "This study cannot be re-joined.",
    dataCollectionDetails: [
      "The date and time",
      "hashed URLs",
      "something else",
    ],
  },
];
