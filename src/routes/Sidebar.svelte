<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import MainSidebar from "../components/layouts/MainSidebar.svelte";
  import ExternalLink from "../components/icons/ExternalLink.svelte";

  export let view = "current-studies";
  export let profileQuestionsAnswered = 0;
  export let totalProfileQuestions = 7;

  const dispatch = createEventDispatcher();
  function send(nextView) {
    return () => {
      if (nextView === 'leave-rally') {
        dispatch("leave-rally");
      } else {
        view = nextView;
        dispatch("change-view", { view });
      }
    }
  }

</script>

<style>

h1 {
    align-self: start;
  }
a, button {
  background-color: none;
  padding: 0;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--color-dark-gray-10);
  font-weight: 700;
  text-decoration: none;
  display: block;
  width: max-content;
  position: relative;
  transition: color .15s;
}

a:hover, ul button:hover {
  color: var(--color-dark-gray-90);
}

ul button.active {
  color: var(--color-dark-gray-90);
}

a::before, ul button::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0%;
  background-color: var(--color-dark-gray-10);
  visibility: hidden;
  transform: scaleX(0);
  transform-origin: left center;
  transition: all 0.15s ease-in-out 0s;
}

a:hover::before, ul button:hover::before {
  visibility: visible;
  opacity: .4;
  transform: scaleX(1);
}

ul button.active::before, ul button.active:hover::before {
  visibility: visible;
  transform: scaleX(1);
  background-color: var(--color-dark-gray-90);
}

ul button.active:hover::before {
  opacity: 1;
  background-color: var(--color-dark-gray-90);
}

ul li + li {
  margin-top: 2rem;
}

li a {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-controls {
  align-self: end;
}

.app-controls button {
  font-size: 14px;
}
</style>

<MainSidebar>
  <button slot='header'in:fly={{duration:800, delay: 600, x: -15}} on:click={send('current-studies')}>
    <h1>
      <img src="img/logo-tall.svg" alt="Mozilla Rally Logo" />
      
    </h1>
  </button>
  <ul slot="navigation" in:fly={{duration: 800, delay: 300, x: -10}}>
    <li><button class:active={view === 'current-studies'} on:click={send('current-studies')}>Current Studies</button></li>
    <li>
      <a class="external" target="_blank" rel="noopener noreferrer" href="https://support.mozilla.org/en-US/kb/about-mozilla-rally">Support
        <ExternalLink /></a>
    </li>
    <li>
      <a class="external" target="_blank" rel="noopener noreferrer" href="__BASE_SITE__/how-rally-works/faqs/">FAQ
        <ExternalLink /></a>
    </li>
  </ul>
  <ul slot="settings" class="app-controls"  in:fly={{duration: 800, delay: 600, x: -10}}>
    <ul class="app-controls">
      <li><button class:active={view === 'manage-profile'} on:click={send('manage-profile')}>
        Manage Profile
      </button>
      <div style="color: var(--color-light-gray-90); font-size: 10px; font-weight: 400; padding-top: 4px;">
        <span style="position: relative;
        display: inline-block;
        transform: translateY(-11.5px);
        font-variant-numeric: tabular-nums;
        min-width: 6.5px;">
          {#key profileQuestionsAnswered}
          <span style="display: inline-block; position: absolute;" in:fly={{duration: 500, y: -24}} out:fly={{duration: 500, y: 24}}>{profileQuestionsAnswered}</span>
          {/key}
        </span>
        / {totalProfileQuestions} Questions Answered
      </div>

    </li>
      <li><button class:active={view === 'privacy-notice'} on:click={send('privacy-notice')}>Privacy Notice</button></li>
      <!-- <li><button class:active={currentView === 'complete-profile'} on:click={send('complete-profile')}>Complete Profile</button></li> -->
      <li><button class:active={view === 'leave-rally'} on:click={send('leave-rally')}>Leave Mozilla Rally</button></li>
    </ul>
  </ul>
</MainSidebar>
