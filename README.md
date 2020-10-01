# Ion

This is the control panel for Ion studies. It may be run in many contexts:

- on the web
- in a cross-browser WebExtension
- as an about: page in Firefox

The "source of truth" for Ion data is on the [Firefox remote settings server](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/pioneer-study-addons-v1/records).

## Get started

Install the dependencies...

```bash
cd ion-svelte
npm install
```

...then start [web-ext](https://github.com/mozilla/web-ext):

```bash
web-ext run
```
