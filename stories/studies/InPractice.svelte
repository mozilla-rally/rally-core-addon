<script>
  import Layout from "../../src/routes/Layout.svelte";
  import StudySet from "./StudySet.svelte";
</script>

<style>
  .studies {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
  }

  h2 {
    margin-bottom: 1rem;
  }
</style>

<Layout>
  <h2>Current Studies</h2>

  <p>
    Some sort of introduction lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut.
  </p>

  <hr />
  <div class="studies">
    <StudySet />
  </div>
</Layout>
