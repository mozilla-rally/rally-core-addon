<script>
  import StudySet from "./StudySet.svelte";
</script>

<style>
  .container {
    background-color: var(--color-light-gray-10);
    min-height: 100vh;
    padding: 1rem;
  }
  .study-card-set {
    width: 660px;
    display: grid;
    /* grid-auto-flow: row;
    grid-row-gap: 1rem; */
    grid-template-columns: 660px 660px;
    align-items: start;
    grid-gap: 1rem;
  }
</style>

<div class="container">
  <div class="study-card-set">
    <StudySet />
  </div>
</div>
