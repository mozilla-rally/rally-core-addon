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

<Layout>
  <Sidebar on:change-view on:leave-rally={() => {
    leaveModal = true;
  }} />
  <Body>
    <slot />
  </Body>
</Layout>

{#if leaveModal}
  <Dialog on:dismiss={() => { leaveModal = false; }}>
    <div slot="title">Leaving Mozilla Rally</div>
  <div style="padding-bottom: 90px;" slot="body">
    Placeholder text.
  </div>
  <div slot="cta">
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