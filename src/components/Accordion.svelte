<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  /* NOTE: This component will be deprecated in favor of /src/components/accordion/Accordion
  We're maintaining it here until we replace the old Ion experience with the new Rally one.
  */

  import { slide } from "svelte/transition";
  import CaretRight from "./icons/CaretRight.svelte";

  let revealed = false;

  export const expand = (v = false) => {
    revealed = v;
  };
</script>

<style>
  section {
    box-sizing: border-box;
    cursor: pointer;
  }

  .accordion-summary {
    background-color: transparent;
    border: none;
    color: white;
    width: 100%;
    text-align: left;
    padding: 0;
    margin: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    font-weight: 700;
    display: grid;
    grid-template-columns: auto 2rem;
    grid-template-rows: max-content max-content;
    grid-template-areas:
      "title carat"
      "description _";
    padding-bottom: 1rem;
    padding-top: 1rem;
    transition: background-color 100ms;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .title {
    align-self: center;
    grid-area: title;
    display: grid;
    align-items: center;
    grid-template-columns: max-content max-content;
    justify-items: start;
    grid-column-gap: 0.5em;
  }
  .carat {
    justify-self: end;
    transition: transform 200ms;
  }

  .expanded-content {
    box-sizing: border-box;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>

<section class:revealed>
  <button
    on:click={() => {
      expand(!revealed);
    }}
    class="accordion-summary">
    <div class="title">
      <slot name="title">Channel</slot>
      <span
        class="carat gafc"
        style="transform: rotate({revealed ? 90 : 0}deg);">
        <CaretRight size="1em" />
      </span>
    </div></button>

  {#if revealed}
    <div transition:slide={{ duration: 200 }} class="expanded-content">
      <slot name="content" />
    </div>
  {/if}
</section>
