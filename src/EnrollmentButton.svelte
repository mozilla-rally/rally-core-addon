<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let enrolled = false;
</script>

<button on:click>{#if enrolled}Leave{:else}Join{/if}
  Rally</button>
