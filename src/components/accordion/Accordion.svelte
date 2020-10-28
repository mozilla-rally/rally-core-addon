<script>
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
