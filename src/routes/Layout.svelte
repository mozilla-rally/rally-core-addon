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
      <p>
        Thanks for helping make the internet just a little bit better. For your reference, leaving Rally means that:
      </p>
      <ul class="mzp-u-list-styled" style="font-weight: bold;">
        <li>We will no longer collect any data for our platform or studies</li>
        <li>You will be removed from any studies you're currently participating in</li>
        <li>We will delete any demographic information you've shared with us</li>
        <li>Researchers will not receive any additional data from you, but will retain access to the data you've already shared with them.</li>
        <li>FIXME for Ryan: the Rally add-on will remove itself from your browser</li>
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