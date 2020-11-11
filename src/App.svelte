<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { setContext } from "svelte";
  import { fly } from "svelte/transition";
  import { store } from "./stores.js";

  import Onboarding from "./routes/Onboarding.svelte";

  import Modal from "./components/Modal.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";
  import Accordion from "./components/Accordion.svelte";

  import StudyList from "./regions/StudyList.svelte";

  import ValueProposition from "./copy/ValueProposition.svelte";
  import HowItWorks from "./copy/HowItWorks.svelte";
  import WhyItMatters from "./copy/WhyItMatters.svelte";

  setContext("rally:store", store);

  let enrollModal = false;

  const closeModal = () => {
    enrollModal = false;
  };

  // As soon as the store has its initial value, let's
  // set firstRun = !enrolled.
  let firstRun;
  $: if ($store && firstRun === undefined) {
    firstRun = !$store.enrolled;
  }
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

<!-- workaround: set the stylesheets for the NEW experience
until we have replaced the entire UX with the Rally UX. Until then,
select which stylesheets to use based on the current view.
Once we have a unified view, we should move these stylesheets
into /public/index.html.-->
<svelte:head>
  {#if $store}
    {#if firstRun}
      <!-- set all the Rally stylesheets. -->
      <link rel="stylesheet" href="build/protocol.css" />
      <link rel="stylesheet" href="build/protocol-extra.css" />
      <link rel="stylesheet" href="rally.css" />
      <link rel="stylesheet" href="tokens.css" />
    {:else}
      <!-- set the current Ion stylesheets -->
      <link rel="stylesheet" href="common.css" />
      <link rel="stylesheet" href="pioneer.css" />
      <link rel="stylesheet" href="global.css" />
    {/if}
  {/if}
</svelte:head>

{#if enrollModal}
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
  {#if firstRun}
    <!-- onboarding flow -->
    <!-- the onboarding-complete event occurs once the user has
    gotten through the profile completion step. -->
    <Onboarding
      on:onboarding-complete={() => {
        firstRun = false;
      }} />
  {:else}
    <!-- main application flow -->
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

      {#if $store.availableStudies}
        <StudyList />
      {/if}
    </main>
  {/if}
{/if}
