<script>
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Button from "../../components/Button.svelte";
  import Graph from "./Graph.svelte";
  import Profile from "./Profile.svelte";
  import Study from "./Study.svelte";
  import Logo from "../../components/Logo.svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .mzp-c-call-out {
    background-color: transparent;
    min-height: 100vh;
    padding: 0px;
  }

  .mzp-l-content {
    padding-left: 0px;
    padding-right: 0px;
  }
  .how-it-works {
    text-align: center;
  }

  .ion-three-cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    justify-items: center;
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
    align-self: start;
  }
</style>

<section class="mzp-c-call-out" in:fly={{ duration: 400, y: 5 }}>
  <div class="mzp-l-content ">
    <div style="width: 60px; margin: auto; padding-bottom: 1rem;">
      <Logo />
    </div>
    <h2 class="mzp-c-call-out-title mzp-has-zap-1">
      Welcome to Mozilla
      <strong>Rally</strong>!
    </h2>

    <p
      class="mzp-c-call-out-desc"
      style="color: var(--color-light-gray-90);
    ">
      A data contribution platform for people to support causes they believe in
    </p>

    <div class="how-it-works"><a href="example.com">how it works</a></div>
    <!-- cards -->

    <div
      in:fly={{ duration: 400, y: 10 }}
      class="ion-three-cards"
      style="padding-top: 3rem; padding-bottom: 3rem;">
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
      class="mzp-c-button-download-container"
      style="width: 185px; display: grid; margin: auto;">
      <Button size="xl" product on:click={() => dispatch('get-started')}>
        Get Started
      </Button>
    </div>
  </div>
</section>
