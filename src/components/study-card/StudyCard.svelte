<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import Header from "./Header.svelte";
  import Button from "../Button.svelte";
  import CheckCircle from "../icons/CheckCircle.svelte";
  import ExternalLink from '../icons/ExternalLink.svelte';
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
    box-shadow: var(--rally-box-shadow-sm);
    background-color: var(--color-white);
    border: 1px solid #ECECED;
  }

  .study-card-content {
    padding-left: var(--left-pad);
  }

  .study-card-description {
    grid-column: 1 / span 2;
    /* offset the last paragraph text margin by a bit more */
    margin-top: 5.5px;
    margin-bottom: 4px;
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
    /* add additional margin to offset buttons from card pad */
    margin-top: 4px;
    margin-right: 4px;
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
    padding-top: 14px;
    grid-column-gap: 3rem;
  }

  .study-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .data-collection-details li {
    margin: 0;
  }

  .data-collection-details li + li {
    margin-top: 8px;
  }

  .study-card-privacy-policy {
    font-size: 14px;
    align-self: start;
  }

  .tag {
    background-color: var(--background, var(--color-marketing-gray-80));
    color: var(--text, var(--color-white));
    padding: 2px 6px 1px 6px;
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

  .header-divider {
    margin-bottom: 20px;
  }

  .joined-study-accordion {
    padding-left: var(--left-pad);
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 36px;
  }

  .joined-study-accordion h4 {
    margin: 0;
  }

  .study-card-joined-date {
    margin: auto;
    font-size: 12px;
    text-align: center;
    color: var(--color-ink-10);
    font-weight: 600;
    font-style: italic;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: 6px;
  }

</style>

<div class="study-card-container radius-sm">
  <Header {endDate}>
    <img
      slot="study-icon"
      class="study-card-image"
      width="60"
      alt="study icon"
      src={imageSrc || "img/default-study-icon.png"} />
    <span slot="study-name"><slot name="name">Study Title</slot></span>
    <span slot="study-author"><slot name="author">Study Author</slot></span>
    <span slot="study-cta">
      <div class="study-card-cta">
        <Button
          size={"md"}
          product={!joined}
          leave={joined}
          on:click={() => {
            dispatch(joined ? 'leave' : 'join');
          }}>
          {#if joined}Leave Study{:else}Join Study{/if}
        </Button>
      </div></span>
  </Header>
  <hr class="header-divider" />
  {#if joined}
    <div class="joined-study-accordion">
      <AccordionButton bind:revealed>
        <h4 class="study-card-subheader text-display-xxs">Study Description</h4>
      </AccordionButton>
      {#if joined}
          <div class="study-card-joined-date">
            {#if joinedDate}
              joined on
              {niceDate(joinedDate)}
            {:else}
              joined
            {/if}
            <span class='gafc' style="transform: translateY(-1px);">
              <CheckCircle size="20px" color="var(--color-green-60)" />
            </span>
          </div>
        {/if}
    </div>
  {/if}
  {#if revealed || !joined}
    <div class="study-card-body" transition:slide|local={{ duration: 200 }}>
      <div class="study-card-content">
      {#if !joined}<h4 class="study-card-subheader text-display-xxs">Study Description</h4>{/if}
      <div class="study-card-description body-copy text-body-sm">
        <slot name="description">
          <p>description missing</p>
        </slot>
      </div>
      {#if dataCollectionDetails.length}
        <div
          class="study-card-section study-card-collected body-copy text-body-sm">
          <h4 class="study-card-subheader text-display-xxs" style="margin-bottom: 10px;">Key Data Collected</h4>
          <ul
            class="mzp-u-list-styled study-card-section-body data-collection-details body-copy text-body-sm">
            {#each dataCollectionDetails as detail}
              <li>{detail}</li>
            {/each}
          </ul>
        </div>
      {/if}
      </div>
      <hr />

      <div class="study-card-footer">
        <div class="study-card-tags">
          {#each tags as tag}
            <div class="tag radius-sm">{tag}</div>
          {/each}
        </div>
    
        <div class="study-card-privacy-policy">
          <a target="_blank" rel="noopener noreferrer" class="external-link" style="--spacing: 6px;" href={privacyPolicyLink}>View Full Study Details <ExternalLink /></a>
        </div>
      </div>
    </div>
  {/if}
</div>
