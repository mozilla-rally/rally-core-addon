<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import Header from "./Header.svelte";
  import Button from "../Button.svelte";
  import DataCollected from "../icons/DataCollected.svelte";
  import Details from "../icons/Details.svelte";
  import CheckCircle from "../icons/CheckCircle.svelte";
  import niceDate from "./nice-date";

  import AccordionButton from "../accordion/AccordionButton.svelte";

  let revealed = false;

  export let endDate;
  export let joined = false;
  export let joinedDate = undefined;
  export let privacyPolicyLink = undefined;
  export let imageSrc;
  export let dataCollectionDetails = [];
  export let tags = [];

  const dispatch = createEventDispatcher();

</script>

<style>
  .study-card-container {
    --icon-size: 60px;
    --gap: 20px;
    --left-pad: calc(var(--icon-size) + var(--gap));

    padding: 1.25rem;
    box-shadow: var(--rally-box-shadow-xs);
    background: url('texture.png'), var(--color-white) repeat;
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
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  .study-card-cta {
    justify-self: end;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    height: 0;
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
    grid-column-gap: 6px;
    grid-row-gap: 0.5rem;
    align-items: center;
    grid-template-areas:
      "icon title"
      "icon body";
  }

  .study-card-subheader {
    color: var(--color-ink-50);
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

  .study-card-icon {
    display: contents;
    color: var(--color-ink-50);
  }

  .study-card-privacy-policy {
    font-size: 14px;
    align-self: start;
  }

  .tag {
    background-color: var(--background, var(--color-marketing-gray-80));
    color: var(--text, var(--color-white));
    padding: 1px 4px;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    display: grid;
    place-items: center;
    text-transform: uppercase;
  }

  hr {
    margin: 0;
    padding: 0;
    border: none;
    border-bottom: 1px solid #c4c4c4;
  }

</style>

<div class="study-card-container radius-sm">
  <Header {endDate}>
    <img
      slot="study-icon"
      class="study-card-image"
      width="60"
      alt="study icon"
      src={imageSrc || "/default-study-icon.png"} />
    <span slot="study-name"><slot name="name">Study Title</slot></span>
    <span slot="study-author"><slot name="author">Study Author</slot></span>
    <span slot="study-cta">
      <div class="study-card-cta">
        <Button
          product={!joined}
          leave={joined}
          on:click={() => {
            dispatch(joined ? 'leave' : 'join');
          }}>
          {#if joined}Leave Study{:else}Join Study{/if}
        </Button>
        {#if joined}
          <div class="study-card-joined-date">
            {#if joinedDate}
              joined on
              {niceDate(joinedDate)}
            {:else}
              joined
            {/if}
            <div class="study-card-joined-date-symbol gafc">
              <CheckCircle />
            </div>
          </div>
        {/if}
      </div></span>
  </Header>
  {#if joined}
    <div style="padding-bottom: 1.5rem; padding-left: var(--left-pad);">
      <AccordionButton bind:revealed>
        <span class="text-body-sm">View More Information</span>
      </AccordionButton>
    </div>
  {/if}

  {#if revealed || !joined}
    <div class="study-card-body" transition:slide|local={{ duration: 200 }}>
      <div class="study-card-description body-copy text-body-sm">
        <h4 class="study-card-subheader text-display-xxs">Study Description</h4>
        <slot name="description">
          <p>description missing</p>
        </slot>
      </div>
      {#if dataCollectionDetails.length}
        <div
          class="study-card-section study-card-collected body-copy text-body-sm">
          <span class='study-card-icon'>
            <DataCollected />
          </span>
          <h4 class="study-card-subheader text-display-xxs">Data Collected</h4>
          <ul
            class="mzp-u-list-styled study-card-section-body body-copy text-body-sm">
            {#each dataCollectionDetails as detail}
              <li>{detail}</li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="study-card-section study-card-details body-copy text-body-sm">
        <span class='study-card-icon'>
          <Details />
        </span>
        <h4 class="study-card-subheader text-display-xxs">Additional Details</h4>
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
      <a href={privacyPolicyLink}>privacy policy</a>
    </div>
  </div>
</div>
