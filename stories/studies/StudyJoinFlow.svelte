<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  // use onboarding layout since it's single column
  import OnboardingLayout from '../../src/components/layouts/OnboardingLayout.svelte';
  import OnboardingBody from '../../src/components/layouts/OnboardingBody.svelte';
  import StudyCard from "../../src/routes/current-studies/StudyCard.svelte";
  import NotificationElement from '../../src/components/notification/NotificationElement.svelte';
  import Check from '../../src/components/icons/Check.svelte';

  let joined = false;

  let notification;
  function showNotification() {
    notification = setTimeout(() => {
      notification = false;
    }, 5000)
  }

  $: console.log(notification)
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

<OnboardingLayout>

  <OnboardingBody>
  <h2>Current Studies</h2>

  <p>
    Some sort of introduction lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut.
  </p> 

  <hr />
  <div class="studies">
    <StudyCard 
      title="Rally's First Example Study"
      author="the Rally Team"
      {joined}
      on:join={() => { joined = true; }}
      on:leave={() => { joined = false; }}
      endDate={new Date(2021, 5, 5)}
      joinedDate={new Date(2020, 12, 5)}
      description={`
This study is a a simple scaffold. Researchers can add any description they prefer here.
`}
      dataCollectionDetails={['the date and time', 'number of browser tabs open', 'page source']}
      tags={['artificial intelligence', 'misinformation']}
      detailsDirectName="Rally Team Website"
      detailsDirectLink="/"
      privacyPolicyLink={'/'}
      on:join={() => {
          joined = true;
          showNotification();
      }}
      on:leave={() => {
          joined = false;
          showNotification();
      }}
    />
  {#if notification}
    {#key notification}
      <NotificationElement location="top">
        <span style="display: contents;" slot="icon">
        <Check />
        </span>
        <span slot="body">successfully {joined ? "joined" : "left"} study</span>
      </NotificationElement>
    {/key}
  {/if}
  </div>
</OnboardingBody>
</OnboardingLayout>