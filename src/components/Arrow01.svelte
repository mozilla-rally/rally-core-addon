<script>
  import { draw, fly, fade } from "svelte/transition";
</script>

<svg
  width="111"
  height="177"
  viewBox="0 0 111 177"
  fill="none"
  out:fade={{ duration: 600 }}
  xmlns="http://www.w3.org/2000/svg">
  <path
    d="M1 176C26.3297 176 57 169.224 57 126C57 99.847 37.5 90 33 107C30.1049 117.937 45.3328 163.572 86.4877 134.123C119.5 110.5 117.91 17.9607 72 4.50003"
    stroke="url(#paint0_linear)"
    stroke-width="2"
    in:draw={{ duration: 1000 }}
    out:draw={{ duration: 500 }}
    stroke-linecap="round" />
  <g
    in:fly={{ x: 10, y: 5, delay: 800, opacity: 0 }}
    out:fly={{ duration: 350, x: 20, y: 10 }}>
    <path
      d="M69.2988 6.44407C68.4185 5.33089 66.4586 2.78549 66.8055 2.01365C67.2266 1.07674 69.1053 1.15493 71.2439 1.03466C73.0503 0.933065 75.8113 0.716407 75.9249 1.8429C76.0026 2.61366 73.7793 3.15641 73.0479 4.72891C72.5361 5.82934 72.8443 8.03488 72.1712 8.52863C71.4981 9.02238 70.1792 7.55726 69.2988 6.44407Z"
      fill="#FF9101" />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear"
      x1="69.5015"
      y1="5.00034"
      x2="1.00103"
      y2="176"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF9100" />
      <stop offset="0.489583" stop-color="#F10366" />
      <stop offset="1" stop-color="#6173FF" />
    </linearGradient>
  </defs>
</svg>
