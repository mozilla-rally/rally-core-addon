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
- `npm run local-build-addon`
- `web-ext run`

To walk through the Core Add-On experience with your study.

## Testing the QA-signed extension

To test the QA-signed extension in Firefox, you must be running the Nightly release or an unbranded build (there are equivalents for Release and Beta), then navigate to `about:config` and create a new boolean pref named `xpinstall.signatures.dev-root` and set it to `true`.

> **Note:** this will cause production-signed extensions (such as those from addons.mozilla.org) to not load. To allow these, set `xpinstall.signatures.required` pref to `false`.

## Developing new frontend components

The Core Add-On uses Storybook to assist in isolated component work. If you're building a new component, look at the examples in `/stories`. To run the storybook, run `npm run storybook`.
