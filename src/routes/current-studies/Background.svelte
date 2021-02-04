<script>/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { tweened } from 'svelte/motion';
import { cubicOut as easing } from 'svelte/easing';

let t = tweened(1, { duration: 800});
let p = tweened(1, {duration: 900, easing})

$: t.set(0);
$: p.set(0);
</script>

<style>
div {
    background-image: 
        linear-gradient(to left, rgba(248, 248, 250, var(--o, 1)), rgba(248, 248, 250, var(--o, 1))), 
        url('img/study-texture.png');
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: calc(15rem + var(--content-width) * .85) var(--p1, 0);
    background-attachment: fixed;
}
</style>
<div style="--o: {$t}; --p1: {$p * 20}px; --p2: {$p * 10}px;">
    <slot />
</div>