<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import CaretRight from "../icons/CaretRight.svelte";

  export let revealed = false;

  export const expand = (v = false) => {
    revealed = v;
  };
</script>

<style>
  .accordion-summary {
    cursor: pointer;
    background-color: transparent;
    border: none;
    width: 100%;
    text-align: left;
    padding: 0;
    margin: 0;
    font-weight: 700;
    display: grid;
    grid-template-columns: auto 2rem;
    grid-template-rows: max-content max-content;
    grid-template-areas:
      "title carat"
      "description _";
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
</style>

<button
  on:click={() => {
    expand(!revealed);
  }}
  class="accordion-summary">
  <div class="title">
    <slot>Channel</slot>
    <span class="carat gafc" style="transform: rotate({revealed ? 90 : 0}deg);">
      <CaretRight size="1em" />
    </span>
  </div></button>
