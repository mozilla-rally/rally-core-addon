# Rally Release Process
The Rally Core Add-on will be shipped as a [browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions), with special Firefox-only privileges.
In order to enable Firefox-specific privileges it requires a signature done on Mozilla infrastructure, in the [`mozilla-extensions`](https://github.com/mozilla-extensions/ion-core-addon/) clone of [this repository](https://github.com/mozilla-ion/ion-core-addon).

The development & release process roughly follows the [GitFlow model](https://nvie.com/posts/a-successful-git-branching-model/).

> **Note:** The rest of this section assumes that `upstream` points to the `https://github.com/mozilla-ion/ion-core-addon` repository,
> `origin` points to the developer fork and `mozext` refers to `https://github.com/mozilla-extensions/ion-core-addon`.
> For some developer workflows, `upstream` can be the same as `origin`.

**Table of Contents**:

* [Published artifacts](#published-artifacts)
* [Standard release](#standard-release)
* [Hotfix release for latest version](#hotfix-release-for-latest-version)
* [Hotfix release for previous version](#hotfix-release-for-previous-version)

## Published artifacts

* A QA-signed version of the Firefox Rally Core Add-on (**only meant for QA**).
* A Mozilla-signed version of the Firefox Rally Core Add-on ([**TODO**](https://github.com/mozilla-ion/ion-core-addon/issues/242)).

## Standard Release

Releases can only be done by one of the project maintainers.

* Main development branch: `master`
* Main release branch: `release`
* Specific release branch: `release-vX.Y.Z`
* Hotfix branch: `hotfix-X.Y.(Z+1)`

### Create a release branch

1. Create a release branch from the `master` branch (note: `25.0.0` is the version number of the *new release*):
    ```
    git checkout -b release-v25.0.0 master
    ```
2. Update the changelog .
    1. Add any missing important changes under the `Unreleased changes` headline.
    2. Commit any changes to the changelog file due to the previous step.
3. Run `bin/prepare-release.sh <new version>` to bump the version number.
    1. The new version should be the next patch, minor or major version of what is currently released (e.g. `25.0.0`).
    2. Let it create a commit for you.
4. Push the new release branch:
    ```
    git push upstream release-v25.0.0
    ```
5. Wait for CI to finish on that branch and ensure it's green:
    * <https://circleci.com/gh/mozilla-ion/ion-core-addon/tree/release-v25.0.0>
6. Apply additional commits for bug fixes to this branch.
    * Adding large new features here is strictly prohibited. They need to go to the `master` branch and wait for the next release.

### Finish a release branch

When CI has finished and is green for your specific release branch, you are ready to cut a release.

1. Check out the main release branch:
    ```
    git checkout release
    ```
2. Merge the specific release branch:
    ```
    git merge --no-ff release-v25.0.0
    ```
3. Push the main release branch:
    ```
    git push upstream release
    ```
4. Tag the release on GitHub:
    1. [Draft a New Release](https://github.com/mozilla-ion/ion-core-addon/releases/new) in the GitHub UI (`Releases > Draft a New Release`).
    2. Enter `v<myversion>` as the tag. It's important this is the same as the version you specified to the `prepare_release.sh` script, with the `v` prefix added.
    3. Select the `release` branch as the target.
     4. Under the description, paste the contents of the release notes from `CHANGELOG.md`.
5. Wait for the CI build to complete for the tag.
    * You can check [on CircleCI for the running build](https://circleci.com/gh/mozilla-ion/ion-core-addon).
6. Send a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-ion/ion-core-addon/compare/master...release-v25.0.0?expand=1>
    * This is important so that no changes are lost.
    * This might have merge conflicts with the `master` branch, which you need to fix before it is merged.
7. Once the above pull request lands, delete the specific release branch (e.g. `release-v25.0.0`).
8. Mirror the release branch and the release tag on the signing repository:
    ```
    git fetch upstream
    git push mozext release
    git push mozext v25.0.0
    ```
9. Trigger the signing process by sending a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-extensions/ion-core-addon/compare/master...release?expand=1>
    * Add the description from the `upstream` GitHub release as the description of the PR.
    * Set the title of the PR to `Release 25.0.0`.
    * This is important so that CI runs the signing process.
    * This should never have conflicts with `master` branch: no change should ever happen on this repository outside from the mirroring and merging.
    * The `dep-signing-ion_core` task will produce a QA-signed build of the add-on on TC. Click on `Details`, then `View task in Taskcluster`. Click the `Artifacts` section to find a link to the signed XPI, e.g. `public/build/ion_core.xpi`. Save it to disk and then add it as an attachment named `qa-ion_core.xpi` to the `v25.0.0` release.
    * Never delete the `release` branch!
10. Refer to [Producing a production-signed extension](#producing-a-production-signed-extension) to build the officially signed add-on.

## Hotfix release for latest version

If the latest released version requires a bug fix, a hotfix branch is used.

### Create a hotfix branch

1. Create a hotfix branch from the main release branch:
    ```
    git checkout -b hotfix-v25.0.1 release
    ```
3. Run `bin/prepare-release.sh <new version>` to bump the version number.
    1. The new version should be the next patch version of what is currently released.
    2. Let it create a commit for you.
4. Push the hotfix branch:
    ```
    git push upstream hotfix-v25.0.1
    ```
5. Create a local hotfix branch for bugfixes:
    ```
    git checkout -b bugfix hotfix-v25.0.1
    ```
5. Fix the bug and commit the fix in one or more separate commits.
6. Push your bug fixes and create a pull request against the hotfix branch: <https://github.com/mozilla-ion/ion-core-addon/compare/hotfix-v25.0.1...your-name:bugfix?expand=1>
7. When that pull request lands, wait for CI to finish on that branch and ensure it's green:
    * <https://circleci.com/gh/mozilla-ion/ion-core-addon/tree/hotfix-v25.0.1>

### Finish a hotfix branch

When CI has finished and is green for your hotfix branch, you are ready to cut a release, similar to a normal release:

1. Check out the main release branch:
    ```
    git checkout release
    ```
2. Merge the hotfix branch:
    ```
    git merge --no-ff hotfix-v25.0.1
    ```
3. Push the main release branch:
    ```
    git push upstream release
    ```
4. Tag the release on GitHub:
    1. [Draft a New Release](https://github.com/mozilla-ion/ion-core-addon/releases/new) in the GitHub UI (`Releases > Draft a New Release`).
    2. Enter `v<myversion>` as the tag. It's important this is the same as the version you specified to the `prepare_release.sh` script, with the `v` prefix added.
    3. Select the `release` branch as the target.
    4. Under the description, paste the contents of the release notes from `CHANGELOG.md`.
5. Wait for the CI build to complete for the tag.
    * You can check [on CircleCI for the running build](https://circleci.com/gh/mozilla-ion/ion-core-addon).
6. Send a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-ion/ion-core-addon/compare/master...hotfix-v25.0.1?expand=1>
    * This is important so that no changes are lost.
    * This might have merge conflicts with the `master` branch, which you need to fix before it is merged.
7. Once the above pull request lands, delete the specific hotfix branch (e.g. `hotfix-v25.0.1`).
8. Mirror the release branch and the release tag on the signing repository:
    ```
    git fetch upstream
    git push mozext release
    git push mozext v25.0.1
    ```
9. Trigger the signing process by sending a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-extensions/ion-core-addon/compare/master...release?expand=1>
    * Add the description from the `upstream` GitHub release as the description of the PR.
    * Set the title of the PR to `Release 25.0.1`.
    * This is important so that CI runs the signing process.
    * This should never have conflicts with `master` branch: no change should ever happen on this repository outside from the mirroring and merging.
    * The `dep-signing-ion_core` task will produce a QA-signed build of the add-on on TC. Click on `Details`, then `View task in Taskcluster`. Click the `Artifacts` section to find a link to the signed XPI, e.g. `public/build/ion_core.xpi`. Save it to disk and then add it as an attachment named `qa-ion_core.xpi` to the `v25.0.1` release.
    * Merge the PR once the build is done but do not delete the `release` branch.
10. Refer to [Producing a production-signed extension](#producing-a-production-signed-extension) to build the officially signed add-on.

## Hotfix release for previous version

If you need to release a hotfix for a previously released version (that is: not the latest released version), you need a support branch.

> **Note**: This should rarely happen. We generally support only the latest released version of Rally.

### Create a support and hotfix branch

1. Create a support branch from the version tag and push it:
    ```
    git checkout -b support/v24.0 v24.0.0
    git push upstream support/v24.0
    ```
2. Create a hotfix branch for this support branch:
    ```
    git checkout -b hotfix-v24.0.1 support/v24.0
    ```
3. Fix the bug and commit the fix in one or more separate commits into your hotfix branch.
4. Push your bug fixes and create a pull request against the support branch: <https://github.com/mozilla-ion/ion-core-addon/compare/support/v24.0...your-name:hotfix-v24.0.1?expand=1>
5. When that pull request lands, wait for CI to finish on that branch and ensure it's green:
    * <https://circleci.com/gh/mozilla-ion/ion-core-addon/tree/support/v24.0>

### Finish a support branch

1. Check out the support branch:
    ```
    git checkout support/v24.0
    ```
2. Update the changelog .
    1. Add any missing important changes under the `Unreleased changes` headline.
    2. Commit any changes to the changelog file due to the previous step.
3. Run `bin/prepare-release.sh <new version>` to bump the version number.
    1. The new version should be the next patch version of the support branch.
    2. Let it create a commit for you.
3. Push the support branch:
    ```
    git push upstream support/v24.0
    ```
4. Tag the release on GitHub:
    1. [Draft a New Release](https://github.com/mozilla-ion/ion-core-addon/releases/new) in the GitHub UI (`Releases > Draft a New Release`).
    2. Enter `v<myversion>` as the tag. It's important this is the same as the version you specified to the `prepare_release.sh` script, with the `v` prefix added.
    3. Select the support branch (e.g. `support/v24.0`) as the target.
    4. Under the description, paste the contents of the release notes from `CHANGELOG.md`.
5. Wait for the CI build to complete for the tag.
    * You can check [on CircleCI for the running build](https://circleci.com/gh/mozilla-ion/ion-core-addon).
6. Send a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-ion/ion-core-addon/compare/master...support/v24.0?expand=1>
    * This is important so that no changes are lost.
    * This might have merge conflicts with the `master` branch, which you need to fix before it is merged.
7. Mirror the release branch and the release tag on the signing repository:
    ```
    git fetch upstream
    git push mozext support/v24.0
    git push mozext v24.0
    ```
8. Trigger the signing process by sending a pull request to merge back the specific release branch to the development branch: <https://github.com/mozilla-extensions/ion-core-addon/compare/master...support/v24.0?expand=1>
    * Add the description from the `upstream` GitHub release as the description of the PR.
    * This is important so that CI runs the signing process.
    * This should never have conflicts with `master` branch: no change should ever happen on this repository outside from the mirroring and merging.
    * The `dep-signing-ion_core` task will produce a QA-signed build of the add-on on TC. Click on `Details`, then `View task in Taskcluster`. Click the `Artifacts` section to find a link to the signed XPI, e.g. `public/build/ion_core.xpi`. Save it to disk and then add it as an attachment named `qa-ion_core.xpi` to the `v24.0` release.
    * Merge the PR once the build is done.
7. Once the above pull request lands, delete the specific hotfix branch (e.g. `support/v24.0`) from both `mozext` and `upstream`.
8. Refer to [Producing a production-signed extension](#producing-a-production-signed-extension) to build the officially signed add-on.

## Producing a production-signed extension

Production signing requires sign-off from addons and releng. The process for kicking off the release is [documented here](https://github.com/mozilla-extensions/xpi-manifest/blob/master/docs/releasing-a-xpi.md#kicking-off-the-release).
See the `#addons-pipeline` channel on Slack for assistance.
