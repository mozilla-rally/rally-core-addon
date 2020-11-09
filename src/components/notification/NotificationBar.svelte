<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  export let width;
  export let level = "info"; // info, error.
  $: style = width ? `--width: ${width}` : undefined;
</script>

<style>
  aside {
    --width: max-content;

    padding: 8px 14px;
    width: var(--width);
    box-shadow: var(--rally-box-shadow-xs);
    /* taken from Figma. Is there a display style we have now that matches? */
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    display: grid;
    /* take from Figma. should this be a variable? */
    grid-column-gap: 10px;
    grid-template-columns: max-content auto max-content;
    align-items: center;
    align-content: center;
  }

  .notification-info,
  .notification-info > * {
    color: #0c0c0d;
    background-color: var(--color-green-20);
  }

  .notification-error,
  .notification-error > * {
    color: var(--color-white);
    background-color: var(--color-red-60);
  }

  .icon {
    font-size: 24px;
    height: 24px;
  }

  .centered {
    height: max-content;
    display: grid;
    align-self: center;
    align-items: center;
    align-content: center;
  }

  .centered > * {
    height: max-content;
    display: grid;
    align-self: center;
    align-items: center;
    align-content: center;
  }
</style>

<aside {style} class="radius-sm notification-{level}">
  <div class="icon centered">
    <slot name="icon" />
  </div>
  <div class="body centered">
    <slot name="body" />
  </div>
  <div class="cta centered">
    <slot name="cta" />
  </div>
</aside>
