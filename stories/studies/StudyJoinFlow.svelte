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
    name: "Test STudy",
    authors: {
      name: "Rally Team"
    },
    icons: {
      64: undefined
    },
    endDate: new Date('2021-07-03'),
    tags: ['ad trackers', 'misinformation', 'profiling'],
    privacyPolicy: {spec: 'https://example.com'},
    description: `This is a mock study. All of the information in this study card is strictly for this example.`,
    dataCollectionDetails: ['page views', 'time and date of joining study', 'etc.'],

  }

  let studies = [];
  fetch('locally-available-studies.json')
    .then(r => r.json())
    .then(s => {
      studies = [nicerStudy, ...s.data];
    });

  function toggleStudyJoinStatus(studyID, joined) {
    // set study.studyJoined if studyID = study.study_id.
    studies = [...studies.map(study => {
      const nextStudy = {...study};
      if (nextStudy.addonId === studyID) {
        nextStudy.studyJoined = joined;
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