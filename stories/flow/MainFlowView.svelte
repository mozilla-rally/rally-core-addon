<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import Layout from '../../src/routes/Layout.svelte';
import CurrentStudies from '../../src/routes/current-studies/Content.svelte';
import PrivacyNotice from '../../src/routes/terms-of-service/Content.svelte';
import Demographics from '../../src/routes/demographics/Content.svelte';

let view = 'current-studies';
function changeView(event) {
    view = event.detail;
}

// TODO: add current studies here.

</script>

<Layout on:change-view={changeView}>
    {#if view === 'complete-profile'}
        <Demographics />
    {:else if view === 'current-studies'}
        <CurrentStudies />
    {:else if view === 'privacy-notice'}
        <PrivacyNotice />
    {:else}
        <CurrentStudies />
    {/if}
</Layout>