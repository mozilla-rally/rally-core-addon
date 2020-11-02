<script>
  import { draw, fly, fade } from "svelte/transition";
  export let delay = 0;
</script>

<svg
  width="120"
  height="73"
  viewBox="0 0 120 73"
  fill="none"
  out:fade={{ duration: 600, delay }}
  xmlns="http://www.w3.org/2000/svg">
  <path
    d="M1 70.0005C1.16667 62.8338 8.6 48.6005 37 49.0005C65.4 49.4005 66 76.7453 37 70.0005C15.5 65.0001 15 34.0001 37 32.5001C59 31.0001 112.5 49.0001 115.5 7.00006"
    stroke="url(#paint0_linear)"
    in:draw={{ duration: 1000, delay }}
    out:draw={{ duration: 500, delay }}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round" />
  <g
    in:fly={{ x: -2, y: 5, delay: 800 + delay, opacity: 0 }}
    out:fly={{ duration: 350, delay, x: 20, y: 10 }}>
    <path
      d="M112.593 4.46717C113.323 3.25048 115.013 0.518138 115.858 0.570156C116.883 0.633299 117.473 2.4186 118.341 4.37694C119.073 6.03112 120.251 8.53784 119.237 9.04186C118.544 9.38672 117.251 7.49821 115.521 7.36917C114.311 7.27886 112.356 8.34597 111.657 7.89055C110.957 7.43513 111.862 5.68386 112.593 4.46717Z"
      fill="#FF9101" />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear"
      x1="1.00008"
      y1="66.0002"
      x2="115"
      y2="7.00005"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#6173FF" />
      <stop offset="0.489583" stop-color="#F10366" />
      <stop offset="1" stop-color="#FF9100" />
    </linearGradient>
  </defs>
</svg>
