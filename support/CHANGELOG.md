# Unreleased changes

# v0.4.0 (2021-02-19)

* [#402](https://github.com/mozilla-rally/rally-core-addon/pull/402): point to the correct URL when no core add-on is found.
* [#386](https://github.com/mozilla-rally/rally-core-addon/pull/386): add remote-controllable "pause" state for studies.

# v0.3.0 (2021-02-08)

* [#337](https://github.com/mozilla-rally/rally-core-addon/pull/337): `initialize` rejects if the study is not allowed to start.

# v0.2.0 (2021-02-02)

* [#316](https://github.com/mozilla-rally/rally-core-addon/pull/316): Migrate to ES6 modules.

# v0.1.0 (2021-22-01)

* [#306](https://github.com/mozilla-rally/core-addon/pull/306): Add a developer mode. When enabled it allows developer to dump the content of pings to the browser console and prevents the Rally information page to be opened if no core-addon is found.
* **Breaking change** - [#262](https://github.com/mozilla-rally/core-addon/pull/262): rename the org from `mozilla-ion` to `mozilla-rally`. Without this change no communication with the core add-on is possible.
* [#269](https://github.com/mozilla-rally/core-addon/pull/269): Allow using the Rally.js support library without a bundler.
