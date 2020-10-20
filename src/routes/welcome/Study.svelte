<script>
  import { tweened } from "svelte/motion";
  import { cubicOut as easing } from "svelte/easing";

  let tw = tweened(0, { easing, duration: 1000, delay: 200 });
  $: tw.set(1);
</script>

<svg
  width="103"
  height="40"
  viewBox="0 0 103 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="8" height="8" opacity={$tw} fill="#B1B1BC" />
  <rect x="12" width={$tw * 44} height="8" fill="#B1B1BC" />
  <rect x="79" width="24" opacity={$tw} height="8" fill="#E31587" />
  <rect y="16" width={$tw * 72} height="8" fill="#EDEDF0" />
  <rect y="32" width={$tw * 96} height="8" fill="#EDEDF0" />
</svg>
