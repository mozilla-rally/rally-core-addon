/* 

This API implementation depends on sending messages back to 
a web extension to store the overall app state whenever it changes.

*/
export default {
  // initialize the frontend's store from the add-on local storage.
  async initialize(key) {},

  // fetch available studies from remote location.
  // use in store instantiation. This assumes that the studies are
  // stored somewhere (i.e. remote settings)
  async getAvailableStudies() {},

  // fetch ion enrollment from remote location, if available.
  // use in the store instantiation.
  async getIonEnrollment() {},

  // return the app state from the add-on.
  // this is called on store instantiation.
  async getItem(key) {},

  // save the app state in the add-on.
  // this fires every time store.produce is called.
  async setItem(key, value) {},

  // updates the study enrollment in the add-on, if needed.
  // NOTE: if updating in the app store in the add-on suffices,
  // this should probably just return the OK signal.
  async updateStudyEnrollment(studyID, enroll) {},

  // updates the overall Ion enrollment in the add-on, if needed.
  // NOTE: if updating in the app store in the add-on suffices,
  // this should probably just return the OK signal.
  async updateIonEnrollment(studyID, enroll) {},
};
