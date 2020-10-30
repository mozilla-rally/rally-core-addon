<script>
  export let padForOnboarding = false;
</script>

<style>
  main {
    width: var(--content-width);
    margin: auto;
    padding: 0px;
    padding-top: 2.5rem;
    padding-bottom: var(--bottom-pad, 0px);
  }
</style>

<main
  style="--bottom-pad: {padForOnboarding ? 'var(--onboarding-cta-offset)' : '0px'}">
  <slot />
</main>
