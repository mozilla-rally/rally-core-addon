<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
-------------- Current Studies --------------

Data points we'll need to support in the store to make this a reality:
- study join date (study.joinedOn, added from the partner support library as soon as the study is successfully joined)
- study end date (study.endDate, this should come from the partner)
- study details link (study.detailsLink), which should be provided by partner
- study details page name (study.detailsLinkName), which should be provided by partner

*/

import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';
import StudyCard from './StudyCard.svelte';

export let studies = [];
export let sidebarOffset = false;

const dispatch = createEventDispatcher();

function joinStudy(studyID) {
    dispatch("join-study", studyID);
}

function leaveStudy(studyID) {
    dispatch("leave-study", studyID);
}

</script>

<style>
.studies {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
}
</style>

<div in:fly={{ duration: 800, y: 5 }}>

    <h2 class='section-header'>Current Studies</h2>

    <p style="font-style: italic;">
        Easily contribute to causes you believe in; you may join multiple studies at once.
    </p> 

    <hr />
    <div class="studies">

    {#each studies as study}
    <StudyCard 
        title={study.name}
        author={study.authors.name}
        joined={(!!study.ionInstalled)}
        imageSrc={study.icons[64]}
        endDate={study.endDate}
        joinedDate={study.joinedOn}
        description={study.description}
        dataCollectionDetails={study.dataCollectionDetails}
        detailsDirectName={study.detailsDirectName}
        detailsDirectLink={study.detailsDirectLink}
        privacyPolicyLink={study.privacyPolicy.spec}
        tags={study.tags}
        {sidebarOffset}
        on:join={() => {
            joinStudy(study.addon_id);
        }}
        on:leave={() => {
            leaveStudy(study.addon_id);
        }}
    />
        {:else}
        No available studies
    {/each}
    </div>

</div>
