# Rally

This is the Core Add-on for the Rally platform. It is implemented as a cross-browser WebExtension, using Svelte for the UI.

Rally studies are implemented as Add-ons. A [study template](https://github.com/mozilla-rally/study-template) is provided to help study authors start writing their study. A [demo website landing page](https://mozilla-rally.github.io/core-addon) is also available for testing the Core Add-on.

The "source of truth" for Rally study metadata is on the [Firefox remote settings server](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records).

## Get started

# Build the UI

Install the dependencies...

```bash
cd ion-svelte
npm install
```

To run a local webserver (`http://localhost:5000`) for the UI which auto-reloads on file save:

```bash
npm run dev
```

# Build the Core addon

When ready, package up for use inside the web extension:

```bash
npm run build
```

Build the local version of the addon:

```bash
npm run build-addon
```

...then start [web-ext](https://github.com/mozilla/web-ext):

```bash
web-ext run
```

`web-ext` defaults to Firefox, it can be run with Chrome:

```bash
web-ext run -t chromium
```

To run test coverage:

```bash
npm run test-addon
```

To run a full integration test using Selenium, in headless browser mode:

```bash
npm run test-integration
```

To generate an installable extension file:

```bash
web-ext build
```

The output will be a `.zip` file in `web-ext-artifacts/` - this should be renamed to `.xpi` for Firefox and `.crx` for Chrome.

## Building and testing a study locally

To run an end-to-end local test with your own study add-on, first build your study (if you don't have one, you can [build the Rally Study Template](https://github.com/mozilla-rally/study-template)) and export the signed build as `<name-of-study>.xpi`. Edit `/public/locally-available-studies.json` so that `sourceURI.spec` is `/public/<name-of-study>.xpi` (you can change the other fields in `/public/locally-available-studies.json` as well for demo purposes as needed).

Then run:

- `npm run build`
- `npm run build-local-addon`
- `web-ext run`

To walk through the Core Add-On experience with your study.

## Testing the QA-signed extension

To test the QA-signed extension in Firefox, you must be running the Nightly release or an unbranded build (there are equivalents for Release and Beta), then navigate to `about:config` and create a new boolean pref named `xpinstall.signatures.dev-root` and set it to `true`.

> **Note:** this will cause production-signed extensions (such as those from addons.mozilla.org) to not load. To allow these, set `xpinstall.signatures.required` pref to `false`.

## Testing Remote Settings changes

The Rally core-addon uses the Firefox [remote settings server](https://remote-settings.readthedocs.io/en/latest/) to publish metadata about current studies.
Changes may be tested locally, or on the dev and staging servers, before pushing live.

> **Note:** `npm run build-local-addon` will produce a build that uses `public/locally-available-studies.json` instead of fetching from Remote Settings. If you are doing local development you most likely want this option.

For developer convenience, a [public remote-settings dev server](https://remote-settings.readthedocs.io/en/latest/tutorial-dev-server.html) is available. Making
changes to staging or production require multiple sign-offs from Mozilla.

You may also set up your own [local remote settings server](https://remote-settings.readthedocs.io/en/latest/tutorial-local-server.html).

> **Note:** Firefox Release cannot be reconfigured to use a different server, an unbranded build such as Firefox Nightly must be used for testing.

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
