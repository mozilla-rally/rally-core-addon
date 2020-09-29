// return Promises to make API compatible with async implementations
export default {
  initialize(key, defaultState) {
    if (localStorage.getItem(key) === null) {
      return Promise.resolve(defaultState);
    }
    return this.getItem(key);
  },
  getItem(key) {
    return Promise.resolve(JSON.parse(window.localStorage.getItem(key)));
  },
  setItem(key, value) {
    return Promise.resolve(
      window.localStorage.setItem(key, JSON.stringify(value))
    );
  },
};
