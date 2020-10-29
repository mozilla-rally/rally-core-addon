<script>
  export let step = 1;
  export let totalSteps = 3;
  export let transparent = false;

  $: style = transparent ? `--background: none` : undefined;
</script>

<style>
  .onboarding-cta-container {
    pointer-events: none;
    --background: linear-gradient(
      to bottom,
      transparent 0%,
      rgb(249, 249, 251) 45%
    );
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
