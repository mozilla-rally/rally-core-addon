<script>
  import { draw, fly, fade } from "svelte/transition";
</script>

<svg
  width="63"
  height="129"
  viewBox="0 0 63 129"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path
    d="M1 127.619C21.591 127.619 45.2219 104 48 86.6193C50.7781 69.2386 49 52.5 37 52.5C25 52.5 24.5 64.7377 39 67.5C53.5 70.2623 90 42.8807 21 6"
    stroke="url(#paint0_linear)"
    stroke-width="2"
    in:draw={{ duration: 1000 }}
    out:draw={{ duration: 500 }}
    stroke-linecap="round" />
  <g
    in:fly={{ x: 10, y: 5, delay: 800, opacity: 0 }}
    out:fly={{ duration: 350, x: 20, y: 10 }}>
    <path
      d="M16.7936 6.80449C16.2329 5.50077 15.0019 2.53349 15.5375 1.87833C16.1876 1.08304 17.9814 1.6468 20.0777 2.08646C21.8484 2.45783 24.5709 2.9662 24.3878 4.0835C24.2626 4.84797 21.9746 4.79424 20.8596 6.12262C20.0794 7.05222 19.8038 9.26208 19.0255 9.56392C18.2472 9.86577 17.3544 8.10822 16.7936 6.80449Z"
      fill="#F53A68" />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear"
      x1="50.7846"
      y1="-43.3675"
      x2="-35.6052"
      y2="104.653"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF9100" />
      <stop offset="0.489583" stop-color="#F10366" />
      <stop offset="1" stop-color="#6173FF" />
    </linearGradient>
  </defs>
</svg>
