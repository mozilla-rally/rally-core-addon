<script>
  import { store } from "../stores.js";
  import StudyCard from "../StudyCard.svelte";
</script>

<style>
  div {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 2rem;
  }
</style>

<div>
  <h2>Current Studies</h2>
  {#each $store.availableStudies as study}
    <StudyCard
      imageSrc={study.icons[64]}
      dataCollectionDetails={study.dataCollectionDetails}
      studyId={study.addon_id}
      enrolled={$store.enrolled}
      privacyPolicy={study.privacyPolicy.spec}
      studyEnrolled={$store.activeStudies.includes(study.addon_id)}
      on:enroll={(e) => {
        const eventData = e.detail;
        if (!eventData
          || typeof eventData != "object"
          || !eventData.studyId) {
          console.error("Invalid enrollment event data");
          return;
        }
        store.updateStudyEnrollment(eventData.studyId, eventData.enroll);
      }}>
      <span slot="name">{study.name}</span>
      <span slot="authors">{study.authors.name}</span>
      <span slot="description">{study.description}</span>
    </StudyCard>
  {/each}
</div>
