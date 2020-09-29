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
      studyEnrolled={$store.activeStudies.includes(study.addon_id)}
      on:enroll={() => store.toggleStudyEnrollment(study.addon_id)}>
      <span slot="name">{study.name}</span>
      <span slot="authors">{study.authors.name}</span>
      <span slot="description">{study.description}</span>
    </StudyCard>
  {/each}
</div>
