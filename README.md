# Ion

This is the Core Add-on for Ion studies. It is implemented as a cross-browser WebExtension, using Svelte for the UI.

Ion studies may be implemented as add-ons, or built-in to the Core Add-on. A [demo study add-on](https://github.com/mozilla-ion/demo-study-addon) and [demo website landing page](https://github.com/mozilla-ion/mozilla-ion.github.io) are available.

The "source of truth" for Ion study metadata is on the [Firefox remote settings server](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records).

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

To generate an installable extension file:

```bash
web-ext build
```

The output will be a `.zip` file in `web-ext-artifacts/` - this should be renamed to `.xpi` for Firefox and `.crx` for Chrome.

## Building and testing a study locally

To run an end-to-end local test with your own study add-on, first build your study (if you don't have one, you can [build the Ion Basic Study](https://github.com/mozilla-ion/ion-basic-study)) and export the build as `<name-of-study>.xpi`. Edit `/public/locally-available-studies.json` so that `sourceURI.spec` is `/public/<name-of-study>.xpi` (you can change the other fields in `/public/locally-available-studies.json` as well for demo purposes as needed). 

Then run:

- `npm run build`
- `npm run demo-build-addon`
- `web-ext run --pref=extensions.experiments.enabled=true -f nightly`

To walk through the Core Add-On experience with your study.
