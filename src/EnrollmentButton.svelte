<script>
  export let enrolled = false;

  const webChannelId = "pioneer";

  function toggleEnrolled() {
    if (enrolled) {
      dispatchFxEvent({ unenroll: true });
    } else {
      dispatchFxEvent({ enroll: true });
    }
  }

  function dispatchFxEvent(message) {
    window.dispatchEvent(
      new window.CustomEvent("WebChannelMessageToChrome", {
        detail: JSON.stringify({
          id: webChannelId,
          message: message,
        }),
      })
    );
  }
</script>

<button on:click={toggleEnrolled}>{#if enrolled}Leave{:else}Join{/if} Ion</button>
