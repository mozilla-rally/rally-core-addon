<script>
  import StudyCard from "../src/StudyCard.svelte";

  const studies = [
    {
      case: "Not enrolled in either ion nor study",
      icon:
        "https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png",
      dataCollectionDetails: ["The date and time"],
      privacyPolicy: "#",
      ionEnrolled: false,
      studyEnrolled: false,
      addonID: "2398439843u429834",
      name: "Basic Study 01",
      authors: "Mozilla",
      description: "Collects generic data",
    },
    {
      case: "Enrolled in Ion, not enrolled in study",
      icon:
        "https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png",
      dataCollectionDetails: ["The date and time"],
      privacyPolicy: "#",
      ionEnrolled: true,
      studyEnrolled: true,
      addonID: "2398439843u429834",
      name: "Basic Study 01",
      authors: "Mozilla",
      description: "Collects generic data",
    },
    {
      case: "Not enrolled in Ion, enrolled in study",
      icon:
        "https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png",
      dataCollectionDetails: ["The date and time"],
      privacyPolicy: "#",
      ionEnrolled: false,
      studyEnrolled: true,
      addonID: "2398439843u429834",
      name: "Basic Study 01",
      authors: "Mozilla",
      description: "Collects generic data",
    },
  ];
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 300px auto;
    align-items: center;
    justify-items: start;
    justify-content: stretch;
    grid-gap: 2rem;
  }

  .example {
    align-self: stretch;
    justify-self: stretch;
    width: 100%;
  }
</style>

<div class="container">
  {#each studies as study}
    <div>{study.case}</div>
    <div class="example">
      <StudyCard
        imageSrc={study.icon}
        dataCollectionDetails={study.dataCollectionDetails}
        studyId={study.addon_id}
        enrolled={study.ionEnrolled}
        privacyPolicy={study.privacyPolicy}
        studyEnrolled={study.studyEnrolled}>
        <span slot="name">{study.name}</span>
        <span slot="authors">{study.authors}</span>
        <span slot="description">{study.description}</span>
      </StudyCard>
    </div>
  {/each}
</div>
