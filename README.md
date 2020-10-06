# Ion

This is the control panel for Ion studies. It is implemented as a cross-browser WebExtension, using Svelte for the UI.

The "source of truth" for Ion data is on the [Firefox remote settings server](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records).

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

When ready, package up for use inside the web extension:

```bash
npm run build
```

...then start [web-ext](https://github.com/mozilla/web-ext):

```bash
web-ext run
```

`web-ext` defaults to Firefox, it can be run with Chrome:

```bash
web-ext run -t chromium
```

# Build the Core addon
With the UI is generated, the addon can finally be built:

```bash
npm run build-addon
```

To run test coverage:

```bash
npm run test-addon
```
