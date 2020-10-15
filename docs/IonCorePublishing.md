# Ion Core Extension Publishing HOWTO

## First-time

Since the core extension requires special Firefox-only privileges, it must use the Mozilla signing infrastructure.
This requires that the github repo is cloned to the `github.com/mozilla-extensions` organization, and have a working `.taskcluster.yml`

The Mozilla Taskcluster CI will then automatically start working for this new clone.

NOTE - this must be a clone and not a fork (TODO - file/link to bug on TC side about this?)

## Finding the QA-signed extension

A good CI run will look like:
https://github.com/mozilla-extensions/ion-core-addon/runs/1249808119

The "dep-signing-ion_core" task will link to the completed build on Taskcluster:
https://firefox-ci-tc.services.mozilla.com/tasks/ZcZWnI5pT4K_1ycCX3l7iw

Click the "Artifacts" link to find a link to the signed XPI `public/build/ion_core.xpi`.

Producing a production-signed extension
---------------------------------------

Production signing requires sign-off from addons and releng.
See the #addons-pipeline channel on Slack for assitance.

Publishing the Ion Core Extension
---------------------------------

TODO - for now we are publishing the signed XPI as a github release, but in the future it will move to addons.mozilla.org

Upload the signed add-on as a github release, and point the static site in `docs/index.html` at the Core XPI file on github.

Updating the Core Extension
---------------------------

Push to the `github.com/mozilla-extensions` clone, and refer to the [Finding the QA-signed extension](#finding-the-qa-signed-extension) and subsequent sections.
