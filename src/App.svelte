<script>
  import { firefox } from "./stores.js";
  import { dispatchFxEvent } from "./stores.js";
  import { onDestroy } from "svelte";

  import StudyCard from "./StudyCard.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";

  let ion;
  const unsubscribe = firefox.subscribe((value) => (ion = value));
  onDestroy(unsubscribe);

  dispatchFxEvent({ removeBadgeCallout: true });
</script>

<style>
  main {
    width: 100%;
    height: 100%;
  }
</style>

<main>
  <header>
    <h1>Put your data to work for a better internet</h1>
    <EnrollmentButton enrolled={ion.enrolled} />
  </header>
  {#if 'availableStudies' in ion > 0}
    {#each ion.availableStudies as study}
      <StudyCard
        imageSrc={study.icons[64]}
        dataCollectionDetails={study.dataCollectionDetails}
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
