<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import Button from "../Button.svelte";
  import DataCollected from "../icons/DataCollected.svelte";
  import Details from "../icons/Details.svelte";
  import CheckCircle from "../icons/CheckCircle.svelte";

  import AccordionButton from "../accordion/AccordionButton.svelte";

  let revealed = false;

  export let endDate;
  export let joined = false;
  export let joinedDate = undefined;
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

  function niceDate(dt) {
    return `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  }
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
    grid-area: title;
  }

  h3 {
    margin: 0px;
    grid-area: title;
    width: 100%;
  }

  .study-card-body {
    padding-left: var(--left-pad);
    display: grid;
    grid-template-columns: auto auto;
    padding-bottom: 1.25rem;
    grid-row-gap: 1.5rem;
    grid-column-gap: 1.5rem;
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

  .study-card-cta {
    justify-self: end;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    height: 0px;
  }

  .study-card-joined-date {
    margin-top: 0.75rem;
    font-size: 12px;
    text-align: right;
    color: var(--color-ink-30);
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: 0.25rem;
  }

  .study-card-joined-date-symbol {
    font-size: 1rem;
    color: var(--color-green-60);
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
    grid-column-gap: 3rem;
  }

  .study-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .study-card-privacy-policy {
    font-size: 14px;
    align-self: start;
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
        {niceDate(endDate)}
      </div>
    </div>
    <div class="study-card-cta">
      <Button
        product={!joined}
        leave={joined}
        on:click={() => {
          if (joined) dispatch('leave');
          else dispatch('join');
        }}>
        {#if joined}Leave Study{:else}Join Study{/if}
      </Button>
      {#if joined}
        <div class="study-card-joined-date">
          joined on
          {niceDate(joinedDate)}
          <div class="study-card-joined-date-symbol gafc">
            <CheckCircle />
          </div>
        </div>
      {/if}
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
