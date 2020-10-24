<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Welcome from "../../src/routes/welcome/Welcome.svelte";
  import FirstRunArrow from "../../src/routes/welcome/FirstRunArrow.svelte";
  import OnboardingCallToAction from "../../src/components/OnboardingCallToAction.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  export let firstRun = false;
</script>

{#if mounted}
  <Layout>
    <Main>
      <div in:fly={{ duration: 800, y: 5 }}>
        <Welcome on:get-started={() => console.log('get started')} {firstRun} />
      </div>
    </Main>
    <OnboardingCallToAction step={1} transparent />
  </Layout>
  {#if firstRun}
    <FirstRunArrow />
  {/if}
{/if}
