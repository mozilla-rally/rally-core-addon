<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  // use onboarding layout since it's single column
  import CurrentStudies from '../../src/routes/current-studies/Content.svelte';
  import OnboardingLayout from '../../src/components/layouts/OnboardingLayout.svelte';
  import OnboardingBody from '../../src/components/layouts/OnboardingBody.svelte';

  // add one nicer study with all the information.
  const nicerStudy = {
    addonId: 'nicer-study-example@mozilla.org',
    name: "Rally Core Study",
    authors: {
      name: "Rally Team"
    },
    icons: {
      64: undefined
    },
    endDate: new Date('2021-07-03'),
    tags: ['ad trackers', 'misinformation', 'profiling'],
    privacyPolicy: {spec: 'https://example.com'},
    description: `This study is a a simple scaffold. Researchers can add any description they prefer here.
    Perpetual sincerity out suspected necessary one but provision satisfied. Respect nothing use set waiting pursuit nay you looking. If on prevailed concluded ye abilities. Address say you new but minuter greater. Do denied agreed in innate. Can and middletons thoroughly themselves him. Tolerably sportsmen belonging in september no am immediate newspaper. Theirs expect dinner it pretty indeed having no of. Principle september she conveying did eat may extensive. `,
    dataCollectionDetails: ['page views', 'time and date of joining study', 'etc.'],

  }

  let studies = [];
  fetch('locally-available-studies.json')
    .then(r => r.json())
    .then(s => {
      studies = [nicerStudy, ...s.data];
    });

  function toggleStudyJoinStatus(studyID, joined) {
    // set study.studyInstalled if studyID = study.study_id.
    studies = [...studies.map(study => {
      const nextStudy = {...study};
      if (nextStudy.addonId === studyID) {
        nextStudy.studyInstalled = joined;
      }
      return nextStudy;
    })];
  }

  function joinStudy(studyID) {
    toggleStudyJoinStatus(studyID, true);
  }

  function leaveStudy(studyID) {
    toggleStudyJoinStatus(studyID, false);
  }
</script>

<OnboardingLayout>
  <OnboardingBody>
    <CurrentStudies
      {studies}
      on:join-study={(evt) => { joinStudy(evt.detail); }}
      on:leave-study={(evt) => { leaveStudy(evt.detail); }}
    />
</OnboardingBody>
</OnboardingLayout>