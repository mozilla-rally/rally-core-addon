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
      studyEnrolled={study.ionInstalled}
      on:enroll={() => store.updateStudyEnrollment(study.addon_id, !study.ionInstalled)}>
      <span slot="name">{study.name}</span>
      <span slot="authors">{study.authors.name}</span>
      <span slot="description">{study.description}</span>
    </StudyCard>
  {/each}
</div>
