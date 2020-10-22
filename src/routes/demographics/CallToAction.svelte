<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
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
</script>

<style>
  .call-flow {
    display: grid;
    grid-template-columns: max-content max-content auto 0px;
    grid-gap: 1rem;
    align-items: center;
  }

  .call-note {
    font-size: 14px;
    justify-self: end;
    font-style: italic;
    color: var(--color-blue-50);
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
  <Button size="xl" product on:click={() => dispatch('save')}>
    Save & Continue
  </Button>
  <Button size="xl" product secondary on:click={() => dispatch('skip')}>
    Cancel
  </Button>
  {#if showArrow === true}
    <div transition:fade={{ duration: 500 }} class="call-note">
      please read through before accepting
    </div>
    <div class="arrow">
      <Arrow02 />
    </div>
  {/if}
</div>
