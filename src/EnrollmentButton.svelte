<script>
  export let enrolled = false;

  function toggleEnrolled() {}
</script>

<button on:click={toggleEnrolled}>{#if enrolled}Leave{:else}Join{/if} Ion</button>
