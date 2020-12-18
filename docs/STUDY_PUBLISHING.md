# Study Extension Publishing HOWTO

## Getting Started

Create account on https://addons.mozilla.org, navigate to the "Developer Hub", and choose "Submit a New Add-on".

## Build your extension

Starting with a github repository containing your study extension (such as [the Rally Study Template](https://github.com/mozilla-rally/study-template)):

* run `web-ext build` to generate your extension in `web-ext-artifacts/`
* upload the resulting `.zip` file in `web-ext-artifacts/` to the https://addons.mozilla.org Developer Hub

It may take some time for your extension to be reviewed and available for download.

## Update RemoteSettings Server

The Rally Core extension checks the Firefox RemoteSettings server for a list of the currently-approved studies.

For local testing, see: https://github.com/mozilla-rally/core-addon#building-and-testing-a-study-locally
There is also a RemoteSettings dev server you may use for local testing / QA: https://remote-settings.readthedocs.io/en/latest/tutorial-dev-server.html

Updates to the staging and production RemoteSettings servers must receive sign off. The current reviewers are @knowtheory and @rhelmer.

## Updating the Study Extension

First, refer to the [Build your extension](#build-your-extension) section. Make sure to update your version numbers!

Once you have your extension ready to publish, the usual addons.mozilla.org update process applies - log in to https://addons.mozilla.org and navigate to the "Developer Hub", then follow the instructions to update your extension.

NOTE - you may publish as a "pre-release" which will prevent existing users from updating until QA is complete.

It may take some time for your updated extension to be reviewed and available for download.

You must update the available studies, which come from the Firefox RemoteSettings server. Refer to the [Update RemoteSettings Server](#update-remotesettings-server) section.
