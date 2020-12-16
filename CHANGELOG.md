# Unreleased changes

[Full changelog](https://github.com/mozilla-rally/core-addon/compare/v0.6.1...master)

* Core-Addon
  * [#237](https://github.com/mozilla-rally/core-addon/pull/237): Remove reliance on the Firefox Pioner ID pref.
  * **Breaking change** - [#262](https://github.com/mozilla-rally/core-addon/pull/262): rename the org from `mozilla-ion` to `mozilla-rally`. Without this change the core add-on won't be able to communicate with the test website.
* `rally.js`
  * **Breaking change** - [#262](https://github.com/mozilla-rally/core-addon/pull/262): rename the org from `mozilla-ion` to `mozilla-rally`. Without this change no communication with the core add-on is possible.
  * [#269](https://github.com/mozilla-rally/core-addon/pull/269): Allow using the Rally.js support library without a bundler.

# v0.6.1 (2020-12-09)

[Full changelog](https://github.com/mozilla-rally/core-addon/compare/v0.6.0...master)

* Added this changelog file.
* The data collected from the demographic survey is being submitted to the Rally servers.
* The full onboarding flow is now complete.
