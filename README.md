# Ion

This is the Core Add-on for Ion studies. It is implemented as a cross-browser WebExtension, using Svelte for the UI.

Ion studies may be implemented as add-ons, or built-in to the Core Add-on. An [demo study add-on](https://github.com/mozilla-ion/demo-study-addon) and [demo website landing page](https://github.com/mozilla-ion/mozilla-ion.github.io) are available.

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