<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { get_current_component as getComponent } from "svelte/internal";
  import { forwardEvents } from "./forwardEvents";
  export let size = "md";
  export let neutral = false;
  export let product = false;
  export let secondary = false;
  export let dark = false;
  export let disabled = false;

  const forwardAll = forwardEvents(getComponent());

  $: sizeClass = size ? `mzp-t-${size}` : undefined;
  $: productClass = product ? `mzp-t-product` : undefined;
  $: neutralClass = neutral ? `mzp-t-neutral` : undefined;
  $: secondaryClass = secondary ? `mzp-t-secondary` : undefined;
  $: darkClass = dark ? `mzp-t-dark` : undefined;
  $: classSet = [
    "mzp-c-button",
    sizeClass,
    productClass,
    neutralClass,
    darkClass,
    secondaryClass,
  ]
    .filter((t) => t)
    .join(" ");
</script>

<button use:forwardAll class={classSet} {disabled}><slot /></button>
