<!-- This component handles the overall layout of the Core Add-On. The onboarding flow is handled elsewhere -->
<script>
  import Layout from "../components/layouts/MainLayout.svelte";
  import Body from "../components/layouts/MainBody.svelte";
  import Sidebar from "./Sidebar.svelte";
</script>

<Layout>
  <Sidebar />
  <Body>
    <slot />
  </Body>
</Layout>
