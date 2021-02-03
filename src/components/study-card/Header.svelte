<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import niceDate from "./nice-date";

  export let endDate;
</script>

<style>
  .study-card-header {
    display: grid;
    grid-gap: 20px;
    margin-bottom: 20px;
    grid-template-columns: var(--study-card-header-columns);
  }

  .study-card-author {
    /* explicitly set this field to prevent Zilla in some contexts */
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    color: var(--color-marketing-gray-70);
  }

  h3 {
    margin: 0;
    grid-area: title;
    width: 100%;
    padding-top: 8px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }
</style>

<div class="study-card-header grid">
  <slot name="study-icon">
    <img
    class="study-card-image"
    width="60"
    alt="study icon"
    src="img/default-study-icon.png" />
  </slot>
  <div class="study-card-header-info">
    <h3 class="text-head-sm">
      <slot name="study-name">Study</slot>
    </h3>
    <div class="study-card-author text-body-xs">
      by
      <slot name="study-author">author</slot>
      {#if endDate}
      | Ends:
        {niceDate(endDate)}
      {/if}
    </div>
  </div>
  <slot name="study-cta" />
</div>
