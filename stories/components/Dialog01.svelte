<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../src/components/Button.svelte";
  import Dialog from "../../src/components/Dialog.svelte";
  import Layout from "../../src/routes/Layout.svelte";
  let dialogActive = false;
  let consented = false;
</script>

<style>
</style>

<Layout>
  <main>
    <Button
      on:click={() => {
        dialogActive = !dialogActive;
      }}>
      Open Dialog.
    </Button>
    <div>Consent status: {consented ? 'consented' : 'not consented'}</div>
    {#if dialogActive}
      <Dialog
        on:dismiss={() => {
          dialogActive = false;
        }}>
        <span slot="title">Do you want to
          {#if consented}Un-Consent{:else}Consent{/if}?</span>
        <div slot="body">This will change the text in the story.</div>
        <div slot="cta">
          <Button
            size="lg"
            product
            on:click={() => {
              consented = !consented;
              dialogActive = false;
            }}>
            {#if consented}Un-Consent{:else}Consent{/if}
          </Button>
          <Button
            size="lg"
            product
            secondary
            on:click={() => {
              dialogActive = false;
            }}>
            Cancel
          </Button>
        </div>
      </Dialog>
    {/if}
  </main>
</Layout>
