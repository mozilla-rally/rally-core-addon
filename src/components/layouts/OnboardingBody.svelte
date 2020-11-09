<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let padForOnboarding = false;
</script>

<style>
  main {
    width: var(--content-width);
    margin: auto;
    padding: 0;
    padding-top: 2.5rem;
    padding-bottom: var(--bottom-pad, 0);
  }
</style>

<main
  style="--bottom-pad: {padForOnboarding ? 'var(--onboarding-cta-offset)' : '0px'};">
  <slot />
</main>
