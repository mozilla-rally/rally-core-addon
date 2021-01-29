<!-- This component handles the overall layout of the Core Add-On. The onboarding flow is handled elsewhere -->
<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from 'svelte';
  import Layout from "../components/layouts/MainLayout.svelte";
  import Body from "../components/layouts/MainBody.svelte";
  import Dialog from '../components/Dialog.svelte';
  import Button from '../components/Button.svelte';
  import Sidebar from "./Sidebar.svelte";
  let leaveModal = false;
  const dispatch = createEventDispatcher();
</script>

<style>
</style>

<Layout>
  <Sidebar on:change-view on:leave-rally={() => {
    leaveModal = true;
  }} />
  <Body>
    <slot />
  </Body>
</Layout>

{#if leaveModal}
  <Dialog width="var(--content-width)" on:dismiss={() => { leaveModal = false; }}>
    <div slot="title">Before You Go…</div>
  <div class='split-content-modal' slot="body">
    <div>
      <p style="padding-top: 20px;">
        Thanks for helping make the internet just a little bit better. For your reference, leaving Rally means that:
      </p>
      <ul class="mzp-u-list-styled">
        <li>We will <b>no longer collect any data</b> for our platform or studies</li>
        <li>You will be <b>removed from any studies</b> you're currently participating in</li>
        <li>We will <b>delete any demographic information</b> you've shared with us</li>
        <li>Researchers will <b>not receive any additional data</b> from you, but will <b>retain access to the data</b> you've already shared with them.</li>
        <li>We will <b>uninstall & remove the Rally add-on</b> and any study add-ons installed through Rally</li>
      </ul> 
    </div>
    <img src="public/img/before-you-go.png" alt="person walking through exit door" />
  </div>
  <div class='modal-call-flow' slot="cta">
      <Button
      size="lg"
      product
      leave
      on:click={() => {
          leaveModal = false;
          dispatch('leave-rally');
      }}>
      Leave Rally
      </Button>
      <Button
      size="lg"
      product
      secondary
      on:click={() => {
          leaveModal = false;
      }}>
      Cancel
      </Button>
  </div>
  </Dialog>
{/if}