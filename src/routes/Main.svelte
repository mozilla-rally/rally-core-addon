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

import { schema as demographicsSchema, inputFormatters } from './demographics/survey-schema';
import { formatAnswersForDisplay } from './demographics/formatters'
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
// Get the number of profile questions answered and format the numerator and denominator accordingly.
// For now, we should expect that the profile questions are the same set as for the demographic survey.
// Before we can count the answered questions, let's transform them back into their display version (the format we use
// for the literal inputs) and then use the questionIsAnswered function to check how many have in fact been answered.
$: formattedDemographicsData = $store.demographicsData ? formatAnswersForDisplay(demographicsSchema, { ...$store.demographicsData }, inputFormatters) : undefined;
$: profileQuestionsAnswered = formattedDemographicsData ? Object.keys(demographicsSchema)
    .filter(key => questionIsAnswered(formattedDemographicsData[key], demographicsSchema[key].type)).length : 0;
// get the total number of available profile questions
$: totalProfileQuestions = Object.keys(demographicsSchema).length;

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
