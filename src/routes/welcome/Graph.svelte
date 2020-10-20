<script>
  import { tweened } from "svelte/motion";
  import { cubicOut as easing } from "svelte/easing";

  let tw = tweened(1, { easing, duration: 1000 });
  $: tw.set(0);
</script>

<svg
  width="100"
  height="40"
  viewBox="0 0 100 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <rect
    y={(40 - 8) * $tw + 8}
    width="10"
    height={(1 - $tw) * 32}
    fill="#B1B1BC" />
  <rect
    x="54"
    y={(40 - 14) * $tw + 14}
    width="10"
    height={(1 - $tw) * 26}
    fill="#B1B1BC" />
  <rect
    x="18"
    y={40 * $tw + 0}
    width="10"
    height={(1 - $tw) * 40}
    fill="#EDEDF0" />
  <rect
    x="36"
    y={(40 - 22) * $tw + 22}
    width="10"
    height={(1 - $tw) * 18}
    fill="#E31587" />
  <rect
    x="72"
    y={(40 - 27) * $tw + 27}
    width="10"
    height={(1 - $tw) * 13}
    fill="#EDEDF0" />
  <rect
    x="90"
    y={(40 - 36) * $tw + 36}
    width="10"
    height={(1 - $tw) * 4}
    fill="#B1B1BC" />
</svg>
