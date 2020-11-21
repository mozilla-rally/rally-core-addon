<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import Button from "../../src/components/Button.svelte";
  import Details from "../../src/components/icons/Details.svelte";
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
      <Button {size} product neutral>product / neutral</Button>
      <Button {size} product neutral disabled>product / neutral</Button>
      <Button {size} neutral>neutral</Button>
      <Button {size} neutral disabled>neutral</Button>
      <Button {size} text product>text</Button>
      <Button {size} text product disabled>text</Button>
      <Button {size} leave>leave</Button>
      <Button {size} leave disabled>leave</Button>
      <Button {size} icon>
        <Details />
      </Button>
      <Button {size} icon disabled>
        <Details />
      </Button>
      <Button {size} icon product>
        <Details />
      </Button>
      <Button {size} icon product disabled>
        <Details />
      </Button>
      <Button {size} icon product secondary>
        <Details />
      </Button>
      <Button {size} icon product secondary disabled>
        <Details />
      </Button>
      <Button {size} icon text>
        <Details />
      </Button>
      <Button {size} icon text disabled>
        <Details />
      </Button>
    </section>
  {/each}
</div>
