<script>
  import { fly } from "svelte/transition";
  import { store } from "./stores.js";
  import { dispatchFxEvent } from "./stores.js";

  import EnrollmentButton from "./EnrollmentButton.svelte";
  import Accordion from "./components/Accordion.svelte";

  import ValueProposition from "./components/copy/ValueProposition.svelte";
  import HowItWorks from "./components/copy/HowItWorks.svelte";

  import StudyList from "./regions/StudyList.svelte";

  import WhyItMatters from "./components/copy/WhyItMatters.svelte";

  dispatchFxEvent({ removeBadgeCallout: true });
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
  }
</style>

{#if $store}
  <main>
    <header>
      <h1>Put your data to work for a better internet</h1>
      <EnrollmentButton
        enrolled={$store.enrolled}
        on:click={() => store.setField('enrolled', !$store.enrolled)} />
    </header>

    <div>
      <ValueProposition />
    </div>

    {#if $store.enrolled}
      <div in:fly={{ duration: 250, y: 5 }}>
        <Accordion>
          <span slot="title">How it Works</span>
          <div slot="content">
            <HowItWorks />
          </div>
        </Accordion>
        <Accordion>
          <span slot="title">Your data: why it matters and how we protect it</span>
          <div slot="content">
            <WhyItMatters />
          </div>
        </Accordion>
      </div>
    {:else}
      <h2>How it Works</h2>
      <HowItWorks />
      <h2>Your data: why it matters and how we protect it</h2>
      <WhyItMatters />
    {/if}

    {#if 'availableStudies' in $store > 0}
      <StudyList />
    {/if}
  </main>
{/if}
