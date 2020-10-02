import availableStudies from "../mocks/available-studies";
/* 

This API implementation depends on sending messages back to 
a web extension to store the overall app state whenever it changes.

*/
export default {
  // initialize the frontend's store from the add-on local storage.
  async initialize(key) {
    // get from
    // returns the last saved app state.
    return this.getItem(key);
  },

  // fetch available studies from remote location.
  // use in store instantiation. This assumes that the studies are
  // stored somewhere (i.e. remote settings)
  async getAvailableStudies() {
    return fetch(
      "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records"
    )
      .then((req) => req.json())
      .then((req) => req.data);
  },

  // fetch ion enrollment from remote location, if available.
  // use in the store instantiation.
  async getIonEnrollment() {
    // this API function will return Ion enrollment status from a remote source.
    // use it primarily when instantiating or updating the app store.
    const state = await this.getItem("__STATE__");
    state.isEnrolled || false;
  },

  // return the app state from the add-on.
  // this is called on store instantiation.
  async getItem(key) {
    return browser.storage.local
      .get(key)
      .then((data) => {
        return data[key];
      })
      .catch(console.error);
  },

  // save the app state in the add-on.
  // this fires every time store.produce is called.
  async setItem(key, value) {
    return browser.storage.local.set({ [key]: value });
  },

  // updates the study enrollment in the add-on, if needed.
  // NOTE: if updating in the app store in the add-on suffices,
  // this should probably just return the OK signal.
  async updateStudyEnrollment(studyID, enroll) {},

  // updates the overall Ion enrollment in the add-on, if needed.
  // NOTE: if updating in the app store in the add-on suffices,
  // this should probably just return the OK signal.
  async updateIonEnrollment(studyID, enroll) {},
};
