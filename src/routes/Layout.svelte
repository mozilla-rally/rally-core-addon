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
  export let profileQuestionsAnswered = 0;
  export let totalProfileQuestions = 7;
</script>

<Layout>
  <Sidebar {totalProfileQuestions} {profileQuestionsAnswered} on:change-view on:leave-rally={() => {
    leaveModal = true;
  }} />
  <Body>
    <slot />
  </Body>
</Layout>

{#if leaveModal}
  <Dialog width="var(--content-width)" on:dismiss={() => { leaveModal = false; }}>
    <div slot="title">Before You Go…</div>
  <div class='split-content-modal' slot="body" style="margin-bottom: 24px; box-sizing: content-box;">
    <div style="width: 368px;">
      <p style="padding-top: 20px;">
        Thanks for helping make the internet just a little bit better. For your reference, leaving Rally means that:
      </p>
      <ul class="mzp-u-list-styled bigger-gap" style="padding-right: 36px;">
        <li>We will <b>no longer collect any data</b> for our platform or studies</li>
        <li>You will be <b>removed from any studies</b> you're currently participating in</li>
        <li>We will <b>delete any demographic information</b> you've shared with us</li>
        <li>If you are currently enrolled in an open study, we will <b>delete all data</b> we've collected through that study to date. However, researchers may still retain access to data you've contributed to <b>completed studies</b>.</li>
        <li>We will <b>uninstall and remove the Rally add-on</b>, and any associated study add-ons that you may have installed.</li>
      </ul> 
    </div>
    <img style="width: 270px; padding-top: 40px; transform: translateX(-24px);" src="img/before-you-go.png" alt="person walking through exit door" />
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