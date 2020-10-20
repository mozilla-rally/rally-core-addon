<script>
  import { createEventDispatcher } from "svelte";

  export let enrolled = false;
  export let studyEnrolled = false;
  export let privacyPolicy = undefined;
  export let imageSrc;
  export let dataCollectionDetails = [];

  const dispatch = createEventDispatcher();
  function toggleStudy() {
    // Bubble up the "enroll" event to the `StudyList` component.
    dispatch("enroll");
  }
</script>

<style>
  .study-card {
    background: var(--in-content-box-background);
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: var(--card-shadow);
    padding: calc(var(--card-padding) - 1px);
    transition: box-shadow 150ms;
  }

  header {
    display: grid;
    grid-template-columns: max-content auto max-content;
    grid-template-rows: auto auto;
    grid-column-gap: 1rem;
    grid-template-areas:
      "icon title button"
      "icon authors button";
  }

  h3 {
    grid-area: title;
    padding: 0px;
    margin: 0px;
  }

  img {
    grid-area: icon;
  }

  button {
    grid-area: button;
    align-self: center;
  }

  .authors {
    grid-area: authors;
    align-self: start;
  }

  .description {
    padding-top: 1.5em;
    padding-bottom: 0.5em;
    background: 0 0 no-repeat;
    background-size: 20px 20px;
    margin: 0 0 0.5em 0;
    line-height: 1.2;
    font-size: 14px;
  }
  .missing {
    color: #999;
  }
</style>

<article class="study-card">
  <header>
    <img width="40" alt="study icon" src={imageSrc} />
    <h3>
      <slot name="name"><span class="missing" /></slot>
    </h3>

    <button
      class="{!studyEnrolled ? 'primary' : 'ghost-button'} join-button"
      disabled={!enrolled}
      on:click={toggleStudy}>{#if studyEnrolled}Leave{:else}Enroll{/if}
    </button>

    <div class="authors">
      <slot name="authors"><span class="missing" /></slot>
    </div>
  </header>

  <div class="icon">
    <slot name="icon"><span class="missing" /></slot>
  </div>

  {#if privacyPolicy}
    <div class="description">
      <slot name="description"><span class="description" /></slot>
      <p>
        You can always find the
        <a href={privacyPolicy}>privacy policy</a>
        at our website.
      </p>
    </div>
  {/if}
  {#if dataCollectionDetails.length}
    <div class="data-collection-details">
      <p>This study will collect</p>
      <ul>
        {#each dataCollectionDetails as detail}
          <li>{detail}</li>
        {/each}
      </ul>
    </div>
  {/if}
</article>
