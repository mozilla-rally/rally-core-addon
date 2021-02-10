<script>/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { tweened } from 'svelte/motion';
import { cubicOut as easing } from 'svelte/easing';

let o1 = tweened(1, { duration: 800});
let layer1 = tweened(1, {duration: 1100, easing, delay: 200});
let layer2 = tweened(1, {duration: 2200, easing});
let m = tweened(0, {duration: 500, easing});

$: o1.set(.2);
$: layer1.set(0);
$: layer2.set(0);

let innerHeight = 0;
let scrollY = 0;

$: documentHeight = document.body.height || 1000;
$: totalDist = documentHeight - innerHeight;
$: percentScrolled = scrollY / totalDist;
$: m.set(percentScrolled);

</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class='study-background' style={`
        --o1: ${$o1};
        --data1: ${$layer1 * 15 + $m * 4}px; 
        --data2: ${-$layer2 * 15  - $m * 7}px;
        --card1: ${-$layer1 * 10  - $m * 3}px;
        --card2: ${$layer2 * 10 + $m * 6}px;`}>
    <slot />
</div>