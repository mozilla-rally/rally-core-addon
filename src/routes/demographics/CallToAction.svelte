<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Arrow02 from "../../components/Arrow02.svelte";
  import Button from "../../components/Button.svelte";

  const dispatch = createEventDispatcher();

  let scrollY = 0;

  let showArrow = true;
  $: if (scrollY > 20) {
    showArrow = false;
  } else {
    showArrow = true;
  }

  let intro = false;
</script>

<style>
  .call-flow {
    grid-template-columns: max-content max-content auto 0;
  }

  .arrow {
    width: 0;
    height: 0;
    display: inline-block;
    transform: translateY(-129px);
  }
</style>

<svelte:window bind:scrollY />

<div
  class="call-flow"
  in:fly={{ duration: 200, y: 5 }}
  out:fly={{ duration: 200, y: -5 }}
  on:introend={() => {
    intro = true;
  }}>
  <Button size="xl" product on:click={() => dispatch('save')}>
    Save & Continue
  </Button>
  <Button size="xl" product secondary on:click={() => dispatch('skip')}>
    Skip for Now
  </Button>
  {#if showArrow & intro}
    <div
      transition:fade={{ duration: 500 }}
      class="shortcut-callout"
      style="text-align: right;">
      all 7 questions are optional; they help researchers parse data
    </div>
    <div class="arrow">
      <Arrow02 />
    </div>
  {/if}
</div>
