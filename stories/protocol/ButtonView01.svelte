<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import Button from "../../src/components/Button.svelte";
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 2rem;
    flex-wrap: wrap;
  }

  section {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 1rem;
  }

  div {
    text-align: center;
  }
</style>

<div class="container">
  {#each ['sm', 'md', 'lg', 'xl'] as size}
    <section>
      <div style="grid-column: 1/3; font-weight: bold;">Size: {size}</div>
      <div>Active</div>
      <div>Disabled</div>
      <Button {size}>standard</Button>
      <Button {size} disabled>standard</Button>
      <Button {size} secondary>secondary</Button>
      <Button {size} secondary disabled>secondary</Button>
      <Button {size} product>product</Button>
      <Button {size} product disabled>product</Button>
      <Button {size} product secondary>product / secondary</Button>
      <Button {size} product secondary disabled>product / secondary</Button>
      <Button {size} neutral>neutral</Button>
      <Button {size} neutral disabled>neutral</Button>
    </section>
  {/each}
</div>
