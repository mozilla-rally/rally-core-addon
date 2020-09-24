<script>
  import { dispatchFxEvent } from "./stores.js";
  export let enrolled = false;

  function toggleEnrolled() {
    if (enrolled) {
      dispatchFxEvent({ unenroll: true });
    } else {
      dispatchFxEvent({ enroll: true });
    }
  }
</script>

<button on:click={toggleEnrolled}>{#if enrolled}Leave{:else}Join{/if} Ion</button>
