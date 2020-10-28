<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import Button from "../Button.svelte";
  import DataCollected from "../icons/DataCollected.svelte";
  import Details from "../icons/Details.svelte";

  import AccordionButton from "../accordion/AccordionButton.svelte";
  import Accordion from "../accordion/Accordion.svelte";

  let revealed = false;

  export let endDate;
  export let joined = false;
  export let privacyPolicy = undefined;
  export let imageSrc;
  export let dataCollectionDetails = [];
  export let tags = [];

  const dispatch = createEventDispatcher();
  function toggleStudy() {
    // Bubble up the "enroll" event to the `StudyList` component.
    dispatch("enroll");
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: 40px auto max-content;
    grid-gap: 1.5rem;
  }

  .study-card-container {
    --icon-size: 40px;
    --gap: 1.5rem;
    --left-pad: calc(var(--icon-size) + var(--gap));
    background-color: var(--color-white);
    padding: 1.25rem;
    box-shadow: var(--rally-box-shadow-xs);
  }

  .study-card-header {
    grid-template-areas: "image title cta";
    margin-bottom: 28px;
  }

  .study-card-image {
    grid-area: image;
  }

  .study-card-header-info {
    width: max-content;
    grid-area: title;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: max-content max-content;
    grid-template-areas:
      "title title"
      "author date";
  }

  h3 {
    margin: 0px;
    grid-area: title;
  }

  .study-card-body {
    padding-left: var(--left-pad);
    display: grid;
    grid-template-columns: auto auto;
    padding-bottom: 1.25rem;
    grid-row-gap: 1.5rem;
  }

  .study-card-description {
    grid-column: 1 / span 2;
  }

  .study-card-description h4 {
    padding-bottom: 0.5rem;
  }

  h4 {
    letter-spacing: -0.2px;
    color: var(--color-marketing-gray-80);
    margin: 0px;
  }

  .study-card-date {
    align-self: end;
    text-align: right;
  }

  .study-card-section {
    display: grid;
    align-self: start;
    grid-template-columns: 20px auto;
    grid-template-rows: auto auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    align-items: center;
    grid-template-areas:
      "icon title"
      "icon body";
  }

  .study-card-section-body {
    grid-area: body;
    align-self: start;
  }

  .study-card-footer {
    display: grid;
    grid-template-columns: auto max-content;
    align-items: center;
    padding-top: 1rem;
  }

  .study-card-tags {
    display: flex;
    column-gap: 0.5rem;
  }

  .study-card-privacy-policy {
    font-size: 14px;
  }

  .tag {
    background-color: var(--background, var(--color-marketing-gray-80));
    color: var(--text, var(--color-white));
    padding: 0.25rem;
    font-size: 12px;
    text-transform: uppercase;
    line-height: 1;
  }

  hr {
    margin: 0px;
    padding: 0px;
    border: none;
    border-bottom: 1px solid #c4c4c4;
  }
</style>

<div class="study-card-container radius-sm">
  <div class="study-card-header grid">
    <img class="study-card-image" width="40" alt="study icon" src={imageSrc} />
    <div class="study-card-header-info">
      <h3 class="text-head-sm">
        <slot name="name">Study</slot>
      </h3>
      <div class="study-card-author text-body-xs">
        by
        <slot name="author">author</slot>
        | Ends:
        {months[endDate.getMonth()]}
        {endDate.getDate()},
        {endDate.getFullYear()}
      </div>
    </div>
    <div class="study-card-cta">
      <Button product={!joined} leave={joined}>
        {#if joined}Leave Study{:else}Join Study{/if}
      </Button>
    </div>
  </div>
  {#if joined}
    <div style="padding-bottom: 1.5rem; padding-left: var(--left-pad);">
      <AccordionButton bind:revealed>
        <span class="text-body-sm">View More Information</span>
      </AccordionButton>
    </div>
  {/if}

  {#if revealed || !joined}
    <div class="study-card-body" transition:slide={{ duration: 200 }}>
      <div class="study-card-description body-copy text-body-sm">
        <h4 class="text-display-xxs">Study Description</h4>
        <slot name="description">
          <p>description missing</p>
        </slot>
      </div>
      {#if dataCollectionDetails.length}
        <div
          class="study-card-section  study-card-collected body-copy text-body-sm">
          <DataCollected />
          <h4 class="text-display-xxs">Data Collected</h4>
          <ul
            class="mzp-u-list-styled study-card-section-body body-copy text-body-sm">
            {#each dataCollectionDetails as detail}
              <li>{detail}</li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="study-card-section study-card-details body-copy text-body-sm">
        <Details />
        <h4 class="text-display-xxs">Details</h4>
        <div class="study-card-section-body">
          <slot name="details">more details</slot>
        </div>
      </div>
    </div>
  {/if}

  <hr />

  <div class="study-card-footer">
    <div class="study-card-tags">
      {#each tags as tag}
        <div class="tag radius-sm">{tag}</div>
      {/each}
    </div>

    <div class="study-card-privacy-policy">
      <a href={privacyPolicy}>privacy policy</a>
    </div>
  </div>
</div>
