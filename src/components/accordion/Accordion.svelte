<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { slide } from "svelte/transition";
  import AccordionButton from "./AccordionButton.svelte";

  export let revealed = false;
</script>

<style>
  .expanded-content {
    box-sizing: border-box;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>

<AccordionButton bind:revealed>
  <slot name="title">expand</slot>
</AccordionButton>

{#if revealed}
  <div transition:slide={{ duration: 200 }} class="expanded-content">
    <slot />
  </div>
{/if}
