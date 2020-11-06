<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { onMount } from "svelte";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Demographics from "../../src/routes/demographics/Content.svelte";
  import OnboardingCTAContainer from "../../src/components/OnboardingCTAContainer.svelte";
  import CallToAction from "../../src/routes/demographics/CallToAction.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  let results;
</script>

{#if mounted}
  <div>
    <Layout>
      <Main padForOnboarding>
        <Demographics bind:results />
      </Main>
      <OnboardingCTAContainer step={3}>
        <CallToAction
          on:save={() => console.log('save', results)}
          on:skip={() => console.log('skip')} />
      </OnboardingCTAContainer>
    </Layout>
  </div>
{/if}
