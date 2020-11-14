<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
    import Layout from "../../src/routes/Layout.svelte";
    import StudyCard from '../../src/routes/current-studies/StudyCard.svelte';

    let joined = false;
    import SuccessfullyJoinedStudyNotification from '../../src/routes/current-studies/SuccessfullyJoinedStudyNotification.svelte';
    import SuccessfullyLeftStudyNotification from '../../src/routes/current-studies/SuccessfullyLeftStudyNotification.svelte';

    let notification;
    function showNotification() {
    notification = setTimeout(() => {
        notification = false;
    }, 3000)
    }
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
      title="Rally's First Example Study"
      author="the Rally Team"
      {joined}
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
      on:cta-clicked={() => {
        // kill any notifications that might be present.
        clearTimeout(notification);
        notification = false;
      }}
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
      {#if joined}
        <SuccessfullyJoinedStudyNotification location="top-left" xOffset="var(--main-notification-offset)" />
      {:else}
        <SuccessfullyLeftStudyNotification  location="top-left" xOffset="var(--main-notification-offset)" />
      {/if}
    {/key}
  {/if}
    </div>
</Layout>
