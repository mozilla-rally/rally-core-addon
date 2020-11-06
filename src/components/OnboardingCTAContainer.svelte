<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { onMount } from "svelte";
  export let step = 1;
  export let totalSteps = 3;
  export let transparent = false;

  let scrollY = 0;
  let innerHeight = 0;
  let bodyHeight = 0;

  onMount(() => {
    bodyHeight = document.body.clientHeight;
    // observe ANY resizes of the browser window, the view port,
    // or whatever, and update the bodyHeight accordingly.
    const resizer = new ResizeObserver(([e]) => {
      bodyHeight = e.contentRect.height;
    });
    resizer.observe(document.body);
  });

  let PX_OFFSET = 130;

  $: gradient = Math.min(1, (bodyHeight - (scrollY + innerHeight)) / PX_OFFSET);

  $: style = transparent
    ? `--background: none`
    : `
--background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(249, 249, 251, ${gradient}) 45%
  );
`;
</script>

<style>
  .onboarding-cta-container {
    pointer-events: none;
    background-blend-mode: screen;
    height: var(--onboarding-cta-height);
    background: var(--background);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-rows: [blank] 2fr [call-to-action] 1fr [steps] 1fr;
    align-items: center;
  }

  .onboarding-cta-inner {
    pointer-events: auto;
    align-self: end;
    grid-row: call-to-action;
    width: var(--content-width);
  }

  .onboarding-cta-inner,
  .onboarding-cta-steps {
    width: 660px;
    margin: auto;
  }

  .onboarding-cta-steps {
    grid-row: steps;
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.5rem;
    align-content: center;
    justify-content: center;
    min-height: 4rem;
  }

  .onboarding-cta-step {
    width: 80px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--color-light-gray-90);
    transition: opacity 200ms;
  }
</style>

<svelte:window bind:scrollY bind:innerHeight />

<div class="onboarding-cta-container" {style}>
  <div class="onboarding-cta-inner">
    <slot />
  </div>
  <div class="onboarding-cta-steps">
    {#each Array.from({ length: totalSteps }).map((_, i) => i) as s}
      <div
        class="onboarding-cta-step"
        style="opacity: {s + 1 === step ? '1' : '.25'}" />
    {/each}
  </div>
</div>
