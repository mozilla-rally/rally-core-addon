<script>
  import { fly } from "svelte/transition";
  import { store } from "./stores.js";
  import { dispatchFxEvent } from "./stores.js";

  import Modal from "./components/Modal.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";
  import Accordion from "./components/Accordion.svelte";

  import StudyList from "./regions/StudyList.svelte";

  import EnrollmentDisclaimer from "./copy/EnrollmentDisclaimer.svelte";
  import ValueProposition from "./copy/ValueProposition.svelte";
  import HowItWorks from "./copy/HowItWorks.svelte";
  import WhyItMatters from "./copy/WhyItMatters.svelte";

  let enrollModal = false;

  const closeModal = () => {
    enrollModal = false;
  };
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

{#if enrollModal && !$store.enrolled}
  <Modal on:dismiss={closeModal}>
    <h2 slot="title">Ion Privacy Consent Notice</h2>
    <div slot="body">
      <EnrollmentDisclaimer />
    </div>
    <div slot="cta">
      <button
        class="primary join-button"
        on:click={() => {
          store.updateIonEnrollment(true);
          enrollModal = false;
        }}>Accept and Participate</button>
      <button on:click={closeModal}>Close</button>
    </div>
  </Modal>
{:else if enrollModal}
  <Modal on:dismiss={closeModal}>
    <h2 slot="title">Are you sure you want to leave Ion?</h2>
    <div slot="body" style="min-height: 100px;">Leaving Ion. Are you sure?</div>
    <div slot="cta">
      <button
        class="primary join-button"
        on:click={() => {
          store.updateIonEnrollment(false);
          enrollModal = false;
        }}>Leave Ion</button>
      <button on:click={closeModal}>Close</button>
    </div>
  </Modal>
{/if}

{#if $store}
  <main>
    <header>
      <h1>Put your data to work for a better internet</h1>
      <EnrollmentButton
        enrolled={$store.enrolled}
        on:click={() => {
          // go through the join flow.
          enrollModal = true;
        }} />
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
