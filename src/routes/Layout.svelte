<!-- This component handles the overall layout of the Core Add-On. The onboarding flow is handled elsewhere -->
<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Layout from "../components/Layouts/MainLayout.svelte";
  import Body from "../components/Layouts/MainBody.svelte";
  import Sidebar from "./Sidebar.svelte";
</script>

<Layout>
  <Sidebar />
  <Body>
    <slot />
  </Body>
</Layout>
