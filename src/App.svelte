<script>
  import { firefox } from "./stores.js";
  import { onDestroy } from "svelte";

  import StudyCard from "./StudyCard.svelte";
  import EnrollmentButton from "./EnrollmentButton.svelte";

  console.debug(firefox);
  let ion;
  const unsubscribe = firefox.subscribe((value) => (ion = value));
  onDestroy(unsubscribe);
  console.debug(ion);
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<main>
  <EnrollmentButton />
  {#await ion}
    <p>...waiting</p>
  {:then value}
    {#if 'availableStudies' in value > 0}
      {#each value.availableStudies as study}
        <StudyCard
          studyId={study.addon_id}
          {value}
          studyEnrolled={value.activeStudies.includes(study.addon_id)}>
          <span slot="name">{study.name}</span>
          <span slot="authors">{study.authors.name}</span>
          <img slot="icon" src={study.icons[64]} alt="Study icon" />
          <span slot="description">{study.description}</span>
        </StudyCard>
      {/each}
    {:else}
      <p>...waiting</p>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>
