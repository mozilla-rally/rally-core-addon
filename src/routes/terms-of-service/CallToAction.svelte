<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
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
</script>

<style>
  .call-flow {
    display: grid;
    grid-template-columns: max-content max-content auto 0px;
    grid-gap: 1rem;
    align-items: center;
  }

  .arrow {
    width: 0px;
    height: 0px;
    display: inline-block;
    transform: translateY(-177px);
  }
</style>

<svelte:window bind:scrollY />

<div class="call-flow">
  <Button size="xl" product on:click={() => dispatch('accept')}>
    Accept and Participate
  </Button>
  <Button size="xl" product secondary on:click={() => dispatch('cancel')}>
    Cancel
  </Button>
  {#if showArrow === true}
    <div transition:fade={{ duration: 500 }} class="shortcut-callout">
      please read through before accepting
    </div>
    <div class="arrow">
      <Arrow01 />
    </div>
  {/if}
</div>
