<script>
  import { fade, fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Button from "../../components/Button.svelte";
  import Graph from "./Graph.svelte";
  import Profile from "./Profile.svelte";
  import Study from "./Study.svelte";
  import Logo from "../../components/MozillaRallyLogo.svelte";
  import ExternalLink from "../../components/icons/ExternalLink.svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .mzp-c-call-out {
    background-color: transparent;
    min-height: calc(100vh - 2.5rem);
    padding: 0px;
  }

  .mzp-l-content {
    padding-left: 0px;
    padding-right: 0px;
    /* this is Main + required padding to meet 120px */
    padding-top: 80px;
  }

  .mzp-c-call-out-title {
    margin-bottom: 12px;
  }
  .how-it-works {
    margin-top: 24px;
    text-align: center;
  }

  .how-it-works a {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: center;
    grid-column-gap: 0.25rem;
  }

  .ion-three-cards {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-evenly;
    justify-items: center;
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .ion-card-container {
    display: grid;
    grid-template-rows: 80px auto;
    justify-items: center;
    align-items: center;
    width: 140px;
  }

  .ion-card {
    background-color: white;
    padding: 1rem;
    display: grid;
    box-shadow: 0px 1px 4px rgba(12, 12, 13, 0.1);
    border-radius: 4px;
  }

  .ion-card-description {
    padding: 0.75rem;
    padding-bottom: 0px;
    align-self: start;
  }
</style>

<section class="mzp-c-call-out">
  <div class="mzp-l-content" in:fly={{ duration: 800, y: 5 }}>
    <h2
      class="mzp-c-call-out-title mzp-has-zap-1"
      in:fly={{ duration: 800, y: 5 }}>
      <Logo />
    </h2>

    <p
      class="mzp-c-call-out-desc"
      style="color: var(--color-light-gray-90);
    ">
      A data contribution platform for people to support causes they believe in
    </p>

    <div in:fly={{ duration: 400, y: 10 }} class="ion-three-cards">
      <div class="ion-card-container">
        <div class="ion-card">
          <Graph />
        </div>
        <div class="ion-card-description">1. agree to our data collection</div>
      </div>
      <div class="ion-card-container">
        <div class="ion-card">
          <Profile />
        </div>
        <div class="ion-card-description">2. complete your profile</div>
      </div>
      <div class="ion-card-container">
        <div class="ion-card">
          <Study />
        </div>
        <div class="ion-card-description">3. join your first study</div>
      </div>
    </div>

    <div
      in:fly={{ duration: 800, y: 5 }}
      class="mzp-c-button-download-container"
      style="width: 185px; display: grid; margin: auto;">
      <Button size="xl" product on:click={() => dispatch('get-started')}>
        Get Started
      </Button>
      <div class="how-it-works">
        <a href="example.com">how it works
          <ExternalLink /></a>
      </div>
    </div>
  </div>
</section>
