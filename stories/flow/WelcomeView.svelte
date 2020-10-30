<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Layout from "../../src/components/layouts/OnboardingLayout.svelte";
  import Body from "../../src/components/layouts/OnboardingBody.svelte";
  import Welcome from "../../src/routes/welcome/Content.svelte";
  import FirstRunArrow from "../../src/routes/welcome/FirstRunArrow.svelte";
  import OnboardingCTAContainer from "../../src/components/OnboardingCTAContainer.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  export let firstRun = false;
</script>

{#if mounted}
  <Layout>
    <Body>
      <div in:fly={{ duration: 800, y: 5 }}>
        <Welcome on:get-started={() => console.log('get started')} {firstRun} />
      </div>
    </Body>
    <OnboardingCTAContainer step={1} transparent />
  </Layout>
  {#if firstRun}
    <FirstRunArrow />
  {/if}
{/if}
