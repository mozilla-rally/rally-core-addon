<style>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
.irb-window {
    /* set color palette for children */
    --irb-background-color: var(--color-light-gray-20);
    --irb-text-color: var(--color-marketing-gray-70);
    --pad: 20px;
    --element-height: var(--height, calc(386px + var(--pad) * 2 + var(--study-card-image-size) + 20px));

    box-sizing: border-box;
    width: 660px;
    /* make the height conform to --height in the Dialog.svelte component. */
    /* element height - header size - dialog padding - margin before buttons */
    height: calc(var(--element-height) - 80px - 40px - var(--pad));
    padding: var(--pad);
    padding-bottom: 0;
    background-color: var(--irb-background-color);
    overflow-y: auto;
    margin-bottom: 20px;
}

.irb-bottom-fader {
    position: sticky;
    left: 0;
    bottom: 0;
    height: 0;
    padding-top: calc(var(--pad) + 1em);
    margin-top: -1em;
    background: linear-gradient(to top, var(--irb-background-color) 1.125em, transparent);
}
</style>
<div class="irb-window">
    <slot />
    <div class="irb-bottom-fader" />
</div>
