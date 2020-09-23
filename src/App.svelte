<script>
  import { firefox } from "./stores.js";
  import { onDestroy } from "svelte";

  import StudyCard from "./StudyCard.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";

  let ion;
  const unsubscribe = firefox.subscribe((value) => (ion = value));
  onDestroy(unsubscribe);
</script>

<style>
  main {
    width: 100%;
    height: 100%;
  }
</style>

<main>
  {#if 'availableStudies' in ion > 0}
    <EnrollmentButton enrolled={ion.enrolled} />

    {#each ion.availableStudies as study}
      <StudyCard
        studyId={study.addon_id}
        enrolled={ion.enrolled}
        studyEnrolled={ion.activeStudies.includes(study.addon_id)}>
        <span slot="name">{study.name}</span>
        <span slot="authors">{study.authors.name}</span>
        <!-- img slot="icon" src={study.icons[64]} alt="Study icon" /-->
        <span slot="description">{study.description}</span>
      </StudyCard>
    {/each}
  {/if}
</main>
