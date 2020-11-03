<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { get_current_component as getComponent } from "svelte/internal";
  import { forwardEvents } from "./forwardEvents";
  // TODO: once this PR lands, let's refactor this
  // to have (1) a size prop and (2) a variant prop.
  // variant can be a string or array of strings.
  export let size = "md";
  export let neutral = false;
  export let product = false;
  export let secondary = false;
  export let dark = false;
  export let leave = false;
  export let icon = false;
  export let text = false;

  // used in CTAs for error notifications.
  export let error = false;

  // used for very compact, small buttons.
  export let compact = false;

  export let disabled = false;

  const forwardAll = forwardEvents(getComponent());

  $: sizeClass = size ? `mzp-t-${size}` : undefined;
  $: productClass = product ? `mzp-t-product` : undefined;
  $: neutralClass = neutral ? `mzp-t-neutral` : undefined;
  $: secondaryClass = secondary ? `mzp-t-secondary` : undefined;
  $: darkClass = dark ? `mzp-t-dark` : undefined;
  $: leaveClass = leave ? `mzp-t-leave` : undefined;
  $: iconClass = icon ? "mzp-t-icon" : undefined;
  $: textClass = text ? "mzp-t-secondary mzp-t-text" : undefined;
  $: errorClass = error ? "mzp-t-error" : undefined;
  $: compactClass = compact ? "mzp-t-compact" : undefined;
  $: classSet = [
    "mzp-c-button",
    sizeClass,
    productClass,
    neutralClass,
    darkClass,
    secondaryClass,
    leaveClass,
    textClass,
    iconClass,
    errorClass,
    compactClass,
  ]
    .filter((t) => t)
    .join(" ");
</script>

<button use:forwardAll class={classSet} {disabled}><slot /></button>
