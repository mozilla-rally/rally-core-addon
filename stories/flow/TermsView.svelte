<script>
  import { onMount } from "svelte";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import TermsOfService from "../../src/routes/terms-of-service/Content.svelte";
  import OnboardingCTAContainer from "../../src/components/OnboardingCTAContainer.svelte";
  import CallToAction from "../../src/routes/terms-of-service/CallToAction.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <div>
    <Layout>
      <Main padForOnboarding>
        <TermsOfService />
      </Main>
      <OnboardingCTAContainer step={2}>
        <CallToAction
          on:accept={() => console.log('accept')}
          on:cancel={() => console.log('cancel')} />
      </OnboardingCTAContainer>
    </Layout>
  </div>
{/if}
