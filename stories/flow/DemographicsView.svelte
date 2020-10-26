<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Demographics from "../../src/routes/demographics/Body.svelte";
  import OnboardingCTAContainer from "../../src/components/OnboardingCTAContainer.svelte";
  import CallToAction from "../../src/routes/demographics/CallToAction.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  let results;
</script>

{#if mounted}
  <div in:fly={{ duration: 800, y: 5 }}>
    <Layout>
      <Main padForOnboarding>
        <Demographics bind:results />
      </Main>
      <OnboardingCTAContainer step={3}>
        <CallToAction
          on:save={() => console.log('save', results)}
          on:skip={() => console.log('skip')} />
      </OnboardingCTAContainer>
    </Layout>
  </div>
{/if}
