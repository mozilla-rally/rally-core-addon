<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { onMount, onDestroy } from "svelte";
let ref;
let portal;
let mounted = false;
onMount(() => {
    portal = document.createElement("div");
    portal.className = "portal";
    document.body.appendChild(portal);
    portal.appendChild(ref);
    mounted = true;
});
onDestroy(() => {
    document.body.removeChild(portal);
});
</script>

<div class="gp-portal" style="display: none;">
<div bind:this={ref}>
    <slot />
</div>
</div>