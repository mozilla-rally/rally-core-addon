<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Layout from "../../src/routes/Layout.svelte";
  import StudyCard from "../../src/components/study-card/StudyCard.svelte";
  import StudyCardHeader from "../../src/components/study-card/Header.svelte";
  import Dialog from "../../src/components/Dialog.svelte";
  import Button from "../../src/components/Button.svelte";
  let joined = false;
  let joinModal = false;
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
    <StudyCard
      {joined}
      on:join={() => {
        joinModal = true;
      }}
      on:leave={() => {
        joinModal = true;
      }}
      endDate={new Date(2021, 5, 5)}
      joinedDate={new Date(2020, 12, 5)}
      imageSrc="https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png"
      dataCollectionDetails={['the date and time', 'number of browser tabs open']}
      tags={['artificial intelligence', 'misinformation']}
      privacyPolicy={'/'}>
      <span slot="name">Smoke Test Example Study 1</span>
      <span slot="author">The Mozilla Foundation</span>
      <p slot="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, ut enim ad minim veniam, ut enim ad minim veniam.
      </p>
      <div slot="details">
        Full study details can be found on the
        <a href="/">University Research Labs website</a>
      </div>
    </StudyCard>
    {#if joinModal}
      <Dialog
        on:dismiss={() => {
          joinModal = false;
        }}>
        <!-- override the dialog Zilla font setting. -->
        <div slot="title">
          {#if !joined}
            <StudyCardHeader endDate={new Date(2020, 5, 5)}>
              <img
                alt="study-icon"
                slot="study-icon"
                src="https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png" />
              <span slot="study-name">Smoke Test Example Study 1</span>
              <span slot="study-author">The Mozilla Foundation</span>
            </StudyCardHeader>
          {:else}Leave this Study?{/if}
        </div>
        <div style="padding-bottom: 90px;" slot="body">
          {#if !joined}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, ut enim ad minim veniam, ut enim ad minim
              veniam.
            </p>
            <p>TBD approach based on explorations with SimplySecure.</p>
          {:else}
            What does it mean to leave
            <ul>
              <li>You will no longer share any data with our platform</li>
              <li>You’ll be removed from any active studies</li>
              <li>We’ll delete your data?</li>
            </ul>
          {/if}
        </div>
        <div slot="cta">
          <Button
            size="lg"
            product
            leave={joined}
            on:click={() => {
              joined = !joined;
              joinModal = false;
            }}>
            {#if joined}Leave Study{:else}Join Study{/if}
          </Button>
          <Button
            size="lg"
            product
            secondary
            on:click={() => {
              joinModal = false;
            }}>
            Cancel
          </Button>
        </div>
      </Dialog>
    {/if}
  </div>
</Layout>
