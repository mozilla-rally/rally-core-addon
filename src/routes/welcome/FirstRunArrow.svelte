<script>
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
