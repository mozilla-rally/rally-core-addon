# Study Extension Publishing HOWTO

## Getting Started

Starting with a github repository containing your study extension (such as [the Ion Basic Study](https://github.com/mozilla-ion/ion-basic-study)):

- create account on https://addons.mozilla.org
- run `web-ext build` to generate your extension in `web-ext-artifacts/`
- upload the resulting `.zip` file in `web-ext-artifacts/` to addons.mozilla.org

It may take some time for your extension to be reviewed and available for download.

## Update RemoteSettings Server

- The Ion Core add-on checks the Firefox RemoteSettings server for a list of the currently-approved studies.
- For local testing, see: https://github.com/mozilla-ion/ion-core-addon#building-and-testing-a-study-locally
- There is also a RemoteSettings dev server you may use for local testing / QA
    - https://remote-settings.readthedocs.io/en/latest/tutorial-dev-server.html
- Updates to the staging and production RemoteSettings servers must receive sign off
    - current reviewers are @knowtheory and @rhelmer

## Updating the Study Extension

The usual addons.mozilla.org update process applies - log in to AMO and navigate to the "Developer Hub" and follow the instructions to update your extension, then refer to the [Update RemoteSettings Server](#updating-remotesettings-server) section.

NOTE - you may publish as a "pre-release" which will prevent existing users from updating until QA is complete.
