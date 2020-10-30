<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { onMount } from "svelte";
  import Layout from "../../src/components/layouts/OnboardingLayout.svelte";
  import Body from "../../src/components/layouts/OnboardingBody.svelte";
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
      <Body padForOnboarding>
        <Demographics bind:results />
      </Body>
      <OnboardingCTAContainer step={3}>
        <CallToAction
          on:save={() => console.log('save', results)}
          on:skip={() => console.log('skip')} />
      </OnboardingCTAContainer>
    </Layout>
  </div>
{/if}
