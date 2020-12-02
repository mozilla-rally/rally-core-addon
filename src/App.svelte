<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { setContext } from "svelte";
  import { store } from "./stores.js";

  import Onboarding from "./routes/Onboarding.svelte";
  import Main from './routes/Main.svelte';
  setContext("rally:store", store);

  // As soon as the store has its initial value, let's
  // set firstRun = !enrolled.
  let firstRun;
  $: if ($store && firstRun === undefined) {
    firstRun = !$store.enrolled;
  }
</script>

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
    <Main
        on:leave-rally={() => { 
          store.updateIonEnrollment(false); 
          // reset to first run until Rally uninstalls itself.
          firstRun = true;
        }}
      />
  {/if}
{/if}
