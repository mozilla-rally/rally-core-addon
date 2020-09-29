<script>
  export let enrolled = false;
</script>

<button on:click>{#if enrolled}Leave{:else}Join{/if}
  Ion</button>
