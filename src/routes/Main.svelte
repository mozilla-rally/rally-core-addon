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

import demographicsSchema from './demographics/survey-schema';
import { questionIsAnswered } from './demographics/survey-tools';

const store = getContext("rally:store");
const notification = getContext("rally:notification");

let view = 'current-studies';
function changeView(event) {
    view = event.detail.view;
    if (!event.detail.suppressNotifications) {
        notification.clear();
    }
    window.scrollTo(0, 0);
}

function joinStudy(studyID) { store.updateStudyEnrollment(studyID, true); notification.send({code: "SUCCESSFULLY_JOINED_STUDY"}); }
function leaveStudy(studyID) { store.updateStudyEnrollment(studyID, false); notification.send({code: "SUCCESSFULLY_LEFT_STUDY"}); }

/* ------------------------------ PROFILE COMPLETION ------------------------------ */
// get the number of profile questions answered
$: profileQuestionsAnswered = $store.demographicsData  ? Object.keys(demographicsSchema)
    .filter(key => questionIsAnswered($store.demographicsData[key], demographicsSchema[key].type)).length : 0;
// get the total number of available profile questions
$: totalProfileQuestions = $store.demographicsData ? Object.keys($store.demographicsData).length : 7;

let mounted = false;
onMount(() => { mounted = true; })

</script>

{#if mounted}

<Layout
    on:change-view={changeView}
    on:leave-rally
    {view}
    {profileQuestionsAnswered}
    {totalProfileQuestions}
>
        {#if view === 'manage-profile'}
            <MainContent>
                <Demographics on:redirect-to={changeView} />
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
                        on:cta-clicked={() => {
                            notification.clear();
                        }}
                        on:join-study={(evt) => { joinStudy(evt.detail); }}
                        on:leave-study={(evt) => { leaveStudy(evt.detail); }} />
                </MainContent>
            </StudyBackgroundElement>
        {/if}
</Layout>
{/if}
