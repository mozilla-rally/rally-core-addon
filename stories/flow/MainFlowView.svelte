<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import MainContent from '../../src/components/layouts/MainContent.svelte';
import Layout from '../../src/routes/Layout.svelte';
import CurrentStudies from '../../src/routes/current-studies/Content.svelte';
import StudyBG from '../../src/routes/current-studies/Background.svelte';
import PrivacyNotice from '../../src/routes/terms-of-service/Content.svelte';
import Demographics from '../../src/routes/demographics/Content.svelte';
import Button from '../../src/components/Button.svelte';

import demographicsSchema from '../../src/routes/demographics/survey-schema';
import { questionIsAnswered } from '../../src/routes/demographics/survey-tools';

import { writable } from 'svelte/store';

let view = 'current-studies';

function changeView(event) {
    if (event.detail !== 'manage-profile') {
        intermediateResults = $demoResults ? {...$demoResults} : undefined;
    }
    view = event.detail;
    window.scrollTo(0, 0);
}

// Create a deep copy of the demoResults for the manage profile view.
// Only update the store when the submit button is explicitly clicked;
// update the intermediate deep copy when demoResults changes.
let demoResults = writable(undefined);
let intermediateResults;
$: if ($demoResults) intermediateResults = { ...$demoResults };
// get the total number of profile questions answered
$: profileQuestionsAnswered = $demoResults  ? Object.keys(demographicsSchema)
    .filter(key => questionIsAnswered($demoResults[key], demographicsSchema[key].type)).length : 0;
// get the total number of available profile questions
$: totalProfileQuestions = $demoResults ? Object.keys($demoResults).length : 7;

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
    detailsDirectName: "Rally Website",
    detailsDirectLink: '#'
}

let studies = [];
fetch('locally-available-studies.json')
    .then(r => r.json())
    .then(s => {
        // studies = [nicerStudy, ...s];
        studies = [nicerStudy, ...s];
    });

function toggleStudyJoinStatus(studyID, joined) {
    studies = [...studies.map(study => {
        const nextStudy = {...study};
        if (nextStudy.addonId === studyID) {
        nextStudy.studyJoined = joined;
        nextStudy.joinedOn = new Date();
        }
        return nextStudy;
    })];
}

function joinStudy(studyID) { toggleStudyJoinStatus(studyID, true); }
function leaveStudy(studyID) { toggleStudyJoinStatus(studyID, false); }

</script>

<Layout on:change-view={changeView} {profileQuestionsAnswered} {totalProfileQuestions}>
    {#if view === 'manage-profile'}
        <MainContent>
            <Demographics results={intermediateResults}>
                <span slot="title">Manage Profile</span>
                <p slot="description">
                    Here's what you've shared with us so far. You can update, add, or rescind your answers as 
                    you see fit. Just a reminder, this info helps us better understand the representitivity of our study
                    participants, and we'll always ask before we share this data with a research partner.
                </p>
                <div slot="call-to-action" let:results let:validated>
                    <hr />
                    <div style="display: grid; grid-auto-flow: column; grid-column-gap: 12px; width: max-content;">
                        <Button size="lg" product leave={!validated} disabled={!validated} on:click={() => {
                            demoResults.set(results);
                        }}>Save Changes</Button>
                        <Button size="lg" product disabled={!validated} secondary on:click={() => {
                            intermediateResults = $demoResults;
                        }}>Cancel</Button>
                    </div>
                </div>
            </Demographics>
        </MainContent>
    {:else if view === 'privacy-notice'}
        <MainContent>
            <PrivacyNotice onboarding={false} />
        </MainContent>
    {:else}
    <StudyBG>
        <MainContent pad={false}>
            <CurrentStudies
                sidebarOffset
                {studies} 
                on:join-study={(evt) => { joinStudy(evt.detail); }}
                on:leave-study={(evt) => { leaveStudy(evt.detail); }} />
        </MainContent>
    </StudyBG>
    {/if}
</Layout>
