<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Button from "../../components/Button.svelte";
  import Logo from "../../components/MozillaRallyLogo.svelte";
  import ExternalLink from "../../components/icons/ExternalLink.svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .mzp-c-call-out {
    background-color: transparent;
    min-height: calc(100vh - 2.5rem);
    padding: 0;
  }

  .mzp-l-content {
    padding-left: 0;
    padding-right: 0;
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
    grid-column-gap: 10.67px;
  }

  .ion-three-cards {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-evenly;
    justify-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .ion-card-container {
    display: grid;
    grid-template-rows: auto auto;
    justify-items: center;
    align-items: center;
    width: 170px;
    color: var(--color-marketing-gray-70);
  }
  .ion-card-container img {
    height: 138px;
  }

  .ion-card-description {
    /* padding: 0.75rem; */
    padding-bottom: 0;
    align-self: start;
  }
</style>

<section class="mzp-c-call-out">
  <div class="mzp-l-content" in:fly={{ duration: 800, y: 5 }}>
    <h2
      class="mzp-c-call-out-title mzp-has-zap-1"
      in:fly={{ duration: 800, y: 5 }}>
      <img src="public/img/logo-wide.svg" alt="Mozilla Rally Logo" />
    </h2>

    <p
      class="mzp-c-call-out-desc"
      style="color: var(--color-marketing-gray-70);
">
      Put your data to work and start building a better internet. But first:
    </p>

    <div in:fly={{ duration: 400, y: 10 }} class="ion-three-cards">
      <div class="ion-card-container">
        <img src="public/img/welcome-01.png" alt='review our privacy policy' />
        <div class="ion-card-description">Review and agree to our Privacy Notice</div>
      </div>
      <div class="ion-card-container">
        <img src="public/img/welcome-02.png" alt='tell us about yourself' />
        <div class="ion-card-description">Tell us about yourself, if you want to</div>
      </div>
      <div class="ion-card-container">
        <img src="public/img/welcome-03.png" alt='join studies' />
        <div class="ion-card-description">Join the study that's right for you</div>
      </div>
    </div>

    <div
      in:fly={{ duration: 800, y: 5 }}
      class="mzp-c-button-download-container"
      style="width: 185px; display: grid; margin: auto;">
      <Button size="xl" product on:click={() => dispatch('get-started')}>
        Get Started
      </Button>
    </div>
    <div class="how-it-works">
      <a target="_blank" href="__BASE_SITE__/how-rally-works/">Wait – how does it work again?
        <ExternalLink /></a>
    </div>
  </div>
</section>
