<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Layout from "../../src/components/Layout.svelte";
  import Main from "../../src/components/Main.svelte";
  import Welcome from "../../src/routes/welcome/Welcome.svelte";

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <div in:fly={{ duration: 800, y: 5 }}>
    <Layout>
      <Main>
        <Welcome on:get-started />
      </Main>
    </Layout>
  </div>
{/if}
