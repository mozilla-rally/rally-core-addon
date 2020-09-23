<script>
  export let enrolled = false;
  export let studyEnrolled = false;

  function toggleStudy() {}
</script>

<style>
  .study-card {
    width: 300px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
  }

  h2 {
    padding: 0 0 0.2em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid #ff3e00;
  }

  .authors,
  .description {
    padding: 0 0 0 1.5em;
    background: 0 0 no-repeat;
    background-size: 20px 20px;
    margin: 0 0 0.5em 0;
    line-height: 1.2;
  }

  .missing {
    color: #999;
  }
</style>

<article class="study-card">
  <h2>
    <slot name="name"><span class="missing">Unknown name</span></slot>
  </h2>

  <div class="authors">
    <slot name="authors"><span class="missing">Unknown authors</span></slot>
  </div>

  <div class="icon">
    <slot name="icon"><span class="missing">Unknown icon</span></slot>
  </div>

  <div class="description">
    <slot name="description">
      <span class="description">Unknown description</span>
    </slot>
  </div>

  <button disabled={!enrolled} on:click={toggleStudy}>{#if studyEnrolled}
      Leave
    {:else}Join{/if} Study</button>
</article>
