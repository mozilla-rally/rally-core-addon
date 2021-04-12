# Rally

This is the Core Add-on for the Rally platform. It is implemented as a cross-browser WebExtension, using Svelte for the UI.

Rally studies are implemented as Add-ons. A [study template](https://github.com/mozilla-rally/study-template) is provided to help study authors start writing their study. A [demo website landing page](https://mozilla-rally.github.io/core-addon) is also available for testing the Core Add-on.

The "source of truth" for Rally study metadata is on the [Firefox remote settings server](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/rally-study-addons-v1/records).

## Get started

# Install the dependencies

```bash
npm install
```

# Building and running the Core addon

Build a local version of the add-on using the list of studies from `public/locally-available-studies.json`

```bash
npm run build
```

...then start the add-on in "watch" mode, which will cause the add-on to auto-reload as you make changes
to the source code:

```bash
npm run watch
```

# Testing the Core addon
To run unit test coverage:

```bash
npm run test
```

To run a full integration test using Selenium, in headless browser mode:

```bash
npm run test-integration
```

# Generating an installable extension file
This produces the production-ready build. However, until it is signed by Mozilla it may not be installed
by end users.

This build will fetch the study list from the Firefox Remote Settings server.
See also [Testing Remote Settings changes](#testing-remote-settings-changes).

```bash
npm run build
```

The output will be a `rally_core.xpi` file in `web-ext-artifacts/`. `.xpi` is the standard file extension for Firefox add-ons,
Chrome uses `.crx`.

Since `rally_core.xpi` is not signed by Mozilla, it may only be installed in a Firefox Nightly build, or an [unbranded Firefox Release/Beta build](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds).

The following must be set in `about:config`:

```
extensions.experiments.enabled = true
xpinstall.signatures.required = false
```

## Building and testing a study locally

To run an end-to-end local test with your own study add-on, first build your study (if you don't have one, you can [build the Rally Study Template](https://github.com/mozilla-rally/study-template)) and export the signed build as `<name-of-study>.xpi`. Edit `/public/locally-available-studies.json` so that `downloadLink` is `/public/<name-of-study>.xpi` (you can change the other fields in `/public/locally-available-studies.json` as well for demo purposes as needed).

Then run:

- `npm run build`
- `npm run build-local-addon`
- `web-ext run`

To walk through the Core Add-On experience with your study.

## Testing the QA-signed extension

To test the QA-signed extension in Firefox, you must be running the Nightly channel or an [unbranded Firefox Release/Beta build](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds), then navigate to `about:config` and create a new boolean pref named `xpinstall.signatures.dev-root` and set it to `true`.

> **Note:** this will cause production-signed extensions (such as those from addons.mozilla.org) to not load. To allow these, set `xpinstall.signatures.required` pref to `false`.

## Testing Remote Settings changes

The Rally core-addon uses the Firefox [remote settings server](https://remote-settings.readthedocs.io/en/latest/) to publish metadata about current studies.
Changes may be tested locally, or on the dev and staging servers, before pushing live.

> **Note:** `npm run build-local-addon` will produce a build that uses `public/locally-available-studies.json` instead of fetching from Remote Settings. If you are doing local development you most likely want this option.

For developer convenience, a [public remote-settings dev server](https://remote-settings.readthedocs.io/en/latest/tutorial-dev-server.html) is available. Making
changes to staging or production require multiple sign-offs from Mozilla.

You may also set up your own [local remote settings server](https://remote-settings.readthedocs.io/en/latest/tutorial-local-server.html).

> **Note:** Firefox Release cannot be reconfigured to use a different server, Firefox Nightly or an [unbranded Firefox Release/Beta build](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds) must be used for testing.

1. In `about:config` on Firefox Nightly, change `services.settings.server` to the URL for your server. If you're using the public remote-settings dev server
described above, then the value will be `https://kinto.dev.mozaws.net/v1`.
2. In the Firefox Browser console, first import the `RemoteSettings` module:
```js
const { RemoteSettings } = ChromeUtils.import(
  "resource://services-settings/remote-settings.js"
);
```
3. Then, disable signature checking and fetch the latest `rally-studies-v1` collection:
```js
RemoteSettings("rally-studies-v1").verifySignature = false;
await RemoteSettings("rally-studies-v1").get();
```
4. The UI for the core add-on options page should respond immediately. After making changes to the RS server, you can either wait or explicitly poll for updates:
```js
await RemoteSettings.pollChanges()
```

## Developing new frontend components

The Core Add-On uses Storybook to assist in isolated component work. If you're building a new component, look at the examples in `/stories`. To run the storybook, run `npm run storybook`.
