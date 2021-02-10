<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { setContext } from "svelte";
  import { store } from "./stores.js";

  import Onboarding from "./routes/Onboarding.svelte";
  import Main from './routes/Main.svelte';
  import NonUSSplashPage from './routes/non-eligible-splashes/NonUSUser.svelte';
  setContext("rally:store", store);

  // As soon as the store has its initial value, let's
  // set firstRun = !enrolled.
  let firstRun;
  $: if ($store && firstRun === undefined) {
    firstRun = !$store.enrolled;
  }

  // We currently exclusively support Rally on en-US locales,
  // but still support enabling/disabling the locale check
  // to enable the development workflows on other locales.
  let isRallySupported = __DISABLE_LOCALE_CHECK__
    ? true
    : navigator.language === "en-US";
  
</script>

{#if isRallySupported}
  {#if $store}
    {#if firstRun}
      <!-- onboarding flow -->
      <!-- the onboarding-complete event occurs once the user has
      gotten through the profile completion step. -->
      <!-- the first-run-initiated event occurs once the user has
      loaded the Welcome page. -->
      <Onboarding
        firstRunCompleted={$store.firstRunCompleted}
        on:first-run-initiated={() => {
          console.log('did this fire?')
          store.setFirstRunCompletion(true);
        }}
        on:onboarding-complete={() => {
          firstRun = false;
        }} />
    {:else}
      <!-- main application flow -->
      <Main
          on:leave-rally={() => {
            store.updatePlatformEnrollment(false);
            // reset to first run until Rally uninstalls itself.
            firstRun = true;
          }}
        />
    {/if}
  {/if}
{:else}
  <NonUSSplashPage on:remove-extension={() => {
    // we will use store.UpdatePlatformEnrollment to
    // uninstall the add-on, even though the user technically
    // does not need to have any deletion pings sent.
    store.updatePlatformEnrollment(false);
  }} />
{/if}
