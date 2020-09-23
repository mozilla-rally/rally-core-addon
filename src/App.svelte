<script>
  import { firefoxIon } from "./stores.js";

  import StudyCard from "./StudyCard.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";

  const webChannelId = "pioneer";

  let enrolled = false;
  let disabled = false;

  let availableStudies = [];
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div>
  <EnrollmentButton {enrolled} />
  {#each availableStudies as study}
    <StudyCard
      studyId={study.addon_id}
      {enrolled}
      studyEnrolled={activeStudies.includes(study.addon_id)}>
      <span slot="name">{study.name}</span>
      <span slot="authors">{study.authors.name}</span>
      <img slot="icon" src={study.icons[64]} alt="Study icon" />
      <span slot="description">{study.description}</span>
    </StudyCard>
  {/each}
</div>
