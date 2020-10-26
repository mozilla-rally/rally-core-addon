<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Arrow01 from "../../components/Arrow01.svelte";
  import Button from "../../components/Button.svelte";

  const dispatch = createEventDispatcher();

  let scrollY = 0;

  let showArrow = true;
  $: if (scrollY > 20) {
    showArrow = false;
  } else {
    showArrow = true;
  }

  // let mounted = false;
  // onMount(() => {
  //   mounted = true;
  // });

  let intro = false;
</script>

<style>
  .call-flow {
    grid-template-columns: max-content max-content auto 0px;
  }

  .arrow {
    width: 0px;
    height: 0px;
    display: inline-block;
    transform: translateY(-177px);
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
  <Button size="xl" product on:click={() => dispatch('accept')}>
    Accept and Participate
  </Button>
  <Button size="xl" product secondary on:click={() => dispatch('cancel')}>
    Cancel
  </Button>
  {#if showArrow && intro}
    <div
      transition:fade={{ duration: 400 }}
      class="shortcut-callout"
      style="text-align: right;">
      please read through before accepting
    </div>
    <div class="arrow">
      <Arrow01 />
    </div>
  {/if}
</div>
