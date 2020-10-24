<script>
  export let noOverflow = false;
</script>

<style>
  div {
    background-color: #f9f9fb;
    min-height: 100vh;
  }

  .no-overflow {
    overflow: hidden;
  }
</style>

<div class="mzp-t-mozilla" class:no-overflow={noOverflow}>
  <slot />
</div>
