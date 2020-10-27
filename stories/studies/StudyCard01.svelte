<script>
  import StudyCard from "../../src/components/study-card/StudyCard.svelte";
</script>

<StudyCard
  endDate={new Date(2020, 12, 5)}
  imageSrc="https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png"
  dataCollectionDetails={['the date and time', 'number of browser tabs open']}
  tags={['artificial intelligence', 'misinformation']}
  privacyPolicy={'/'}>
  <span slot="name">Smoke Test Example Study 1</span>
  <span slot="author">The Mozilla Foundation</span>
  <p slot="description">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    ut enim ad minim veniam, ut enim ad minim veniam.
  </p>
</StudyCard>
