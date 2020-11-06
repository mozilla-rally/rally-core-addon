<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fade } from "svelte/transition";
  import Arrow00 from "../../components/Arrow00.svelte";
</script>

<style>
  .first-run {
    position: fixed;
    right: 60px;
    top: 8px;
  }

  .first-run div {
    transform: translateX(-50px);
  }
</style>

<div class="first-run" in:fade={{ delay: 500 }}>
  <Arrow00 delay={500} />
  <div transition:fade={{ duration: 500, delay: 500 }} class="shortcut-callout">
    shortcut added!
  </div>
</div>
