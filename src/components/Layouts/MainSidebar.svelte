<script>
  import VerticalLogo from "../VerticalLogo.svelte";
</script>

<style>
  .sidebar {
    position: sticky;
    top: 0px;
    left: 0px;
    height: 100vh;
    background-color: var(--color-light-gray-20);
    width: 15rem;
    padding: 2rem 2.5rem;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: [header] max-content [nav] auto [app] max-content;
    align-content: stretch;
    align-items: start;
    grid-row-gap: 2rem;
  }

  h1 {
    align-self: start;
  }
</style>

<div class="sidebar">
  <h1>
    <VerticalLogo />
  </h1>
  <slot name="navigation" />
  <slot name="settings" />
</div>
