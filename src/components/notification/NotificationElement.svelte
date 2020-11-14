<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { scale } from 'svelte/transition'
  export let width;
  export let level = "info"; // info, error.

  export let xOffset;
  export let yOffset;

  // positioning elements.
  export let location;

  // if specified, set the width variable.

  function makeStyle({width, xOffset, yOffset}) {
    let styles = [
      width ? `--width: ${width}` : undefined,
      xOffset ? `--x-offset: ${xOffset}` : undefined,
      yOffset ? `--y-offset: ${yOffset}` : undefined,
    ]
    return styles.filter(d=> d !== undefined).join('; ');
  }

  $: style = makeStyle({width, xOffset, yOffset});
  
</script>

<style>
  aside {
    --width: max-content;

    padding: 8px 14px;
    width: var(--width);
    box-shadow: var(--rally-box-shadow-xs);
    /* taken from Figma. Is there a display style we have now that matches? */
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
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

  .notification-floating {
    position: fixed;
    --pad: 20px;
    /* stylelint-disable */
    --x-offset: 0px;
    --y-offset: 0px;
    /* stylelint-enable */
    --x-pad: calc(var(--pad) + var(--x-offset));
    --y-pad: calc(var(--pad) + var(--y-offset));


    /* --y-pad: calc(var(--pad, 20px) + var(--y-offset, 0)); */

  }

  .notification-floating-bottom, .notification-floating-bottom-center {
    bottom: var(--y-pad);
    left: calc(50% + var(--x-offset));
    transform: translateX(-50%);
  }

  .notification-floating-bottom-right {
    right: var(--x-pad);
    bottom: var(--y-pad);
  }

  .notification-floating-bottom-left {
    left: var(--x-pad);
    bottom: var(--y-pad);
  }

  .notification-floating-top, .notification-floating-top-center {
    top: var(--y-pad);
    left: calc(50% + var(--x-offset));
    transform: translateX(-50%);
  }

  .notification-floating-top-left {
    left: var(--x-pad);
    top: var(--y-pad);
  }

  .notification-floating-top-right {
    right: var(--x-pad);
    top: var(--y-pad);
  }
</style>

<aside 
  transition:scale={{duration: 200, start: .98, opacity: 0}}
  style={style} class="radius-sm notification-{level} 
    {location !== undefined ? `notification-floating notification-floating-${location}` : ''}">
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
