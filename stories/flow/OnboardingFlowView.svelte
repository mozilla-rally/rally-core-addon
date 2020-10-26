<script>
  import { onMount } from "svelte";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Welcome from "../../src/routes/welcome/Welcome.svelte";
  import Demographics from "../../src/routes/demographics/Body.svelte";
  import TermsOfService from "../../src/routes/terms-of-service/OnboardingTOC.svelte";
  import OnboardingCallToAction from "../../src/components/OnboardingCallToAction.svelte";

  import DemographicsCallToAction from "../../src/routes/demographics/CallToAction.svelte";
  import TermsCallToAction from "../../src/routes/terms-of-service/CallToAction.svelte";

  let which = "welcome";
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  function send(next) {
    which = next;
    window.scrollTo(0, 0);
  }

  function step(w) {
    if (w === "welcome") return 1;
    if (w === "terms") return 2;
    if (w === "demographics") return 3;
    return 1;
  }

  let results;
</script>

{#if mounted}
  <div>
    <Layout>
      <Main padForOnboarding={which !== 'welcome'}>
        {#if which === 'welcome'}
          <Welcome on:get-started={() => send('terms')} />
        {:else if which === 'terms'}
          <TermsOfService />
        {:else if which === 'demographics'}
          <Demographics bind:results />
        {/if}
      </Main>
      <OnboardingCallToAction
        step={step(which)}
        transparent={which === 'welcome'}>
        {#if which === 'terms'}
          <TermsCallToAction
            on:accept={() => {
              send('demographics');
            }}
            on:cancel={() => {
              send('welcome');
            }} />
        {:else if which === 'demographics'}
          <DemographicsCallToAction
            on:save={() => {
              send('welcome');
            }}
            on:skip={() => send('welcome')} />
        {/if}
      </OnboardingCallToAction>
    </Layout>
  </div>
{/if}
