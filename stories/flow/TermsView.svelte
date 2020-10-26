<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Terms from "../../src/routes/terms-of-service/OnboardingTOC.svelte";
  import OnboardingCTAContainer from "../../src/components/OnboardingCTAContainer.svelte";
  import CallToAction from "../../src/routes/terms-of-service/CallToAction.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <div in:fly={{ duration: 800, y: 5 }}>
    <Layout>
      <Main padForOnboarding>
        <Terms />
      </Main>
      <OnboardingCTAContainer step={2}>
        <CallToAction
          on:accept={() => console.log('accept')}
          on:cancel={() => console.log('cancel')} />
      </OnboardingCTAContainer>
    </Layout>
  </div>
{/if}
