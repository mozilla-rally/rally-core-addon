<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import Layout from '../../src/routes/Layout.svelte';
import CurrentStudies from '../../src/routes/current-studies/Content.svelte';
import PrivacyNotice from '../../src/routes/terms-of-service/Content.svelte';
import Demographics from '../../src/routes/demographics/Content.svelte';

let view = 'current-studies';
function changeView(event) {
    view = event.detail;
}

// add one nicer study with all the information.
const nicerStudy = {
    addon_id: 'nicer-study-example@mozilla.org',
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
    detailsDirectName: "Rally Website",
    detailsDirectLink: '#'
}

let studies = [];
fetch('locally-available-studies.json')
    .then(r => r.json())
    .then(s => { 
        studies = [nicerStudy, ...s.data]; 
    });

function toggleStudyJoinStatus(studyID, joined) {
    studies = [...studies.map(study => {
        const nextStudy = {...study};
        if (nextStudy.addon_id === studyID) {
        nextStudy.ionInstalled = joined;
        }
        return nextStudy;
    })];
}

function joinStudy(studyID) { toggleStudyJoinStatus(studyID, true); }
function leaveStudy(studyID) { toggleStudyJoinStatus(studyID, false); }

</script>

<Layout on:change-view={changeView}>
    {#if view === 'complete-profile'}
        <Demographics />
    {:else if view === 'privacy-notice'}
        <PrivacyNotice />
    {:else}
        <CurrentStudies 
            {studies} 
            on:join-study={(evt) => { joinStudy(evt.detail); }}
            on:leave-study={(evt) => { leaveStudy(evt.detail); }} />
    {/if}
</Layout>