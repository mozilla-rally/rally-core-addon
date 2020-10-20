<script>
  export let step = 1;
  export let totalSteps = 3;
</script>

<style>
  .onboarding-cta-container {
    height: 430px;
    background: linear-gradient(to top, rgb(249, 249, 251) 65%, transparent);
    position: sticky;
    width: 100%;
    bottom: 0;
    width: 100%;
    display: grid;
    grid-template-rows: [blank] 1fr [call-to-action] 1fr [steps] 1fr;
    align-items: center;
  }

  .onboarding-cta-inner {
    align-self: end;
    grid-row: call-to-action;
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
</style>

<div class="onboarding-cta-container">
  <div class="onboarding-cta-inner">
    <slot />
  </div>
  <div class="onboarding-cta-steps">
    {#each Array.from({ length: totalSteps }).map((_, i) => i) as s}
      <div
        style="
        width: 80px;
        height: 5px; 
        border-radius: 5px;
        background-color: var(--color-light-gray-90);
        opacity: {s + 1 === step ? '1' : '.25'};
      " />
    {/each}
  </div>
</div>
