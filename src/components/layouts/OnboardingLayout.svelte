<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let noOverflow = false;
</script>

<style>
  div {
    min-height: 100vh;
  }

  .no-overflow {
    overflow: hidden;
  }
</style>

<div class="mzp-t-mozilla noise-background" class:no-overflow={noOverflow}>
  <slot />
</div>
