<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Button from "../../src/components/Button.svelte";
  import Arrow01 from "../../src/components/Arrow01.svelte";
  import Terms from "../../src/routes/terms-of-service/OnboardingTOC.svelte";
  import OnboardingCallToAction from "../../src/components/OnboardingCallToAction.svelte";

  let scrollY = 0;
  let mounted = false;
  onMount(() => {
    mounted = true;
  });

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

{#if mounted}
  <div in:fly={{ duration: 800, y: 5 }}>
    <Layout>
      <Main>
        <Terms />
      </Main>
      <OnboardingCallToAction step={2}>
        <div class="call-flow">
          <Button size="xl" product>Accept and Participate</Button>
          <Button size="xl" product secondary>Cancel</Button>
          {#if showArrow === true}
            <div transition:fade={{ duration: 500 }} class="call-note">
              please read through before accepting
            </div>
            <div class="arrow">
              <Arrow01 />
            </div>
          {/if}
        </div>
      </OnboardingCallToAction>
    </Layout>
  </div>
{/if}
