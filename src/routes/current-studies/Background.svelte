<script>/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { tweened } from 'svelte/motion';
import { cubicOut as easing } from 'svelte/easing';

let t = tweened(1, { duration: 800});
let p = tweened(1, {duration: 1100, easing});
let m = tweened(0, {duration: 500, easing});

$: t.set(0);
$: p.set(0);

let innerHeight = 0;
let scrollY = 0;

$: documentHeight = document.body.height || 1000;
$: totalDist = documentHeight - innerHeight;
$: percentScrolled = scrollY / totalDist;
$: m.set(percentScrolled);

</script>

<style>
div {
    padding: 2rem 2.5rem;
    background-image: 
        linear-gradient(to left, rgba(248, 248, 250, var(--o, 1)), rgba(248, 248, 250, var(--o, 1))), 
        url('img/study-card-bg-top.png'), url('img/study-card-bg-bottom.png');
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: left top, calc(15rem + var(--content-width) * .85) var(--p1, 0), calc(15rem + var(--content-width) * .85) var(--p2, 0);
    background-attachment: fixed;
}
</style>

<svelte:window bind:scrollY bind:innerHeight />

<div style="--o: {$t}; --p1: {$p * 35 + $m * 3}px; --p2: {$p * 20  - $m * 3}px;">
    <slot />
</div>