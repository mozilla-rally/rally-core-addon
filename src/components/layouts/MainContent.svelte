<script> /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export let pad = true;
</script>
<style>
div {
    display: grid;
    grid-template-columns: var(--content-width);
    background-size: 100% 100%;
    background-attachment: fixed;
    margin: var(--pad, 0);
    margin-right: 0;
    box-sizing: border-box;
}
</style>

<div style="--pad: {pad ? "2rem 2.5rem" : "0"};">
    <slot />
</div>