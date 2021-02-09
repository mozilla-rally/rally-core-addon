<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { getContext, onMount } from 'svelte';
import Layout from './Layout.svelte';
import CurrentStudies from './current-studies/Content.svelte';
import PrivacyNotice from './terms-of-service/Content.svelte';
import Demographics from './demographics/MainDemographicsView.svelte';
import StudyBackgroundElement from './current-studies/Background.svelte';
import MainContent from '../components/layouts/MainContent.svelte';

const store = getContext("rally:store");

let view = 'current-studies';
function changeView(event) {
    view = event.detail;
    window.scrollTo(0, 0);
}

function joinStudy(studyID) { store.updateStudyEnrollment(studyID, true); }
function leaveStudy(studyID) { store.updateStudyEnrollment(studyID, false); }

/* ------------------------------ PROFILE COMPLETION ------------------------------ */
// get the number of profile questions answered
$: profileQuestionsAnswered = $store.demographicsData ? Object.keys($store.demographicsData).filter(key => {
    if (Array.isArray($store.demographicsData[key]) || typeof $store.demographicsData[key] === 'string') return $store.demographicsData[key].length > 0;
    return $store.demographicsData[key] !== undefined;
}).length : 0;
// get the total number of available profile questions
$: totalProfileQuestions = $store.demographicsData ? Object.keys($store.demographicsData).length : 7;

let mounted = false;
onMount(() => { mounted = true; })

</script>

{#if mounted}

<Layout 
    on:change-view={changeView}
    on:leave-rally
    {profileQuestionsAnswered}
    {totalProfileQuestions}
>
        {#if view === 'manage-profile'}
            <MainContent>
                <Demographics />
            </MainContent>
        {:else if view === 'privacy-notice'}
            <MainContent>
                <PrivacyNotice onboarding={false} />
            </MainContent>
        {:else}
            <StudyBackgroundElement>
                <MainContent  pad={false}>
                    <CurrentStudies
                        sidebarOffset
                        studies={$store.availableStudies}
                        on:join-study={(evt) => { joinStudy(evt.detail); }}
                        on:leave-study={(evt) => { leaveStudy(evt.detail); }} />
                </MainContent>
            </StudyBackgroundElement>
        {/if}
</Layout>
{/if}
