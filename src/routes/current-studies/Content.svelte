<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* 
-------------- Current Studies -------------- 

Data points we'll need to support in the store to make this a reality:
- study join date (study.joinedOn, added from Ion.js as soon as the study is successfully joined)
- study end date (study.endDate, this should come from the partner)
- study details link (study.detailsLink), which should be provided by partner
- study details page name (study.detailsLinkName), which should be provided by partner

*/

import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';
import StudyCard from './StudyCard.svelte';
import SuccessfullyJoinedStudyNotification from './SuccessfullyJoinedStudyNotification.svelte';
import SuccessfullyLeftStudyNotification from './SuccessfullyLeftStudyNotification.svelte';

export let studies = [];

const dispatch = createEventDispatcher();

function joinStudy(studyID) {
    dispatch("join-study", studyID);
}

function leaveStudy(studyID) {
    dispatch("leave-study", studyID);
}

// TODO: move the notification system to
// a separate global component once we have a notification system.

let notificationID;
let whichNotification;
function showNotification(joinOrLeave) {
    whichNotification = joinOrLeave;
    notificationID = setTimeout(() => {
        whichNotification = undefined;
        notificationID = false;
    }, 3000);
}

</script>

<style>
    .studies {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 1rem;
    }

    h2 {
        margin-bottom: 1rem;
    }
</style>

<div  in:fly={{ duration: 800, y: 5 }}>

    <h2>Current Studies</h2>

    <p>
    Some sort of introduction lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut.
    </p> 

    <hr />
    <div class="studies">

    {#each studies as study, i (study.addon_id)}
    <StudyCard 
        title={study.name}
        author={study.authors.name}
        joined={(!!study.ionInstalled)}
        imageSrc={study.icons[64]}
        endDate={study.endDate}
        joinedDate={study.joinedOn}
        description={study.description}
        dataCollectionDetails={study.dataCollectionDetails}
        detailsDirectName={study.detailsSiteName}
        detailsDirectLink={study.detailsLink}
        privacyPolicyLink={study.privacyPolicy.spec}
        tags={study.tags}
        on:cta-clicked={() => {
        // kill any notifications that might be present.
        clearTimeout(notificationID);
        notificationID = false;
        }}
        on:join={() => {
            joinStudy(study.addon_id);
            showNotification('joined');
        }}
        on:leave={() => {
            leaveStudy(study.addon_id);
            showNotification('left');
        }}
    />
        {:else}
        No available studies
    {/each}
    </div>

</div>

{#if notificationID}
    {#key notificationID}
        {#if whichNotification === 'joined'}<SuccessfullyJoinedStudyNotification />{:else}<SuccessfullyLeftStudyNotification />
        {/if}
    {/key}
{/if}