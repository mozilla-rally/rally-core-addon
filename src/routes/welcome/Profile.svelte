<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { tweened } from "svelte/motion";
  import { cubicOut as easing } from "svelte/easing";

  let tw = tweened(0, { easing, duration: 1000, delay: 200 });
  $: tw.set(1);
</script>

<svg
  width="101"
  height="42"
  viewBox="0 0 101 42"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <rect x="17" y="1" width={$tw * 64} height="8" fill="#EDEDF0" />
  <circle cx="5" cy="5" r={4.5 * $tw} fill="white" stroke="#CDCDD4" />
  <rect x="17" y="17" width={$tw * 84} height="8" fill="#B1B1BC" />
  <circle cx="5" cy="21" r={4.5 * $tw} fill="#E31587" stroke="#E31587" />
  <rect x="17" y="33" width={$tw * 48} height="8" fill="#EDEDF0" />
  <circle cx="5" cy="37" r={4.5 * $tw} fill="white" stroke="#CDCDD4" />
</svg>
