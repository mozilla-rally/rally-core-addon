<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import Layout from './Layout.svelte';
import PrivacyNotice from './terms-of-service/Content.svelte';
import Demographics from './demographics/Content.svelte'
// TODO: integrate ./current-studies/Content.svelte once appropriate.

let view = PrivacyNotice;
function changeView(event) {
  if (event.detail === 'complete-profile') view = Demographics;
  else view = PrivacyNotice;

}

// CurrentStudies view.
// Terms of service view.

</script>

<Layout on:change-view={changeView}>
    <svelte:component this={view} />
</Layout>