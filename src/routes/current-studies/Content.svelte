<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

function parseDateIfNeeded(date) {
    if (date === undefined || (typeof date === 'object' && typeof date.getMonth === 'function')) return date;
    try {
        let endDate = date.split('-');
        let day = +endDate[2];
        let month = +endDate[1] - 1;
        let year = +endDate[0];
        return new Date(year, month, day);
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

// Sort studies using order property, if set.
studies.sort((a, b) => a.order - b.order);

</script>

<style>
.current-studies {
    min-height: calc(100vh - 4rem);
}
p {
    margin: 0;
}
.studies {
    margin-top: 28px;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
}
</style>

<div class='current-studies' in:fly={{ duration: 800, y: 5 }}>

    <h2 class='section-header'>Current Studies</h2>

    <p>
        Browse available studies and find the choice (or choices) that feel right to you.
    </p>

    <div class="studies">

    {#each studies as study, i (study.addonId)}
    <StudyCard
        title={study.name}
        author={study.authors.name}
        joined={(!!study.studyJoined)}
        imageSrc={study.icons[64]}
        addonId={study.addonId}
        endDate={parseDateIfNeeded(study.endDate)}
        joinedDate={parseDateIfNeeded(study.joinedOn)}
        description={study.description}
        dataCollectionDetails={study.dataCollectionDetails}
        studyDetailsLink={study.studyDetailsLink}
        tags={study.tags}
        {sidebarOffset}
        on:cta-clicked
        on:join={() => {
            joinStudy(study.addonId);
        }}
        on:leave={() => {
            leaveStudy(study.addonId);
        }}
    />
        {:else}
        No available studies
    {/each}
    </div>

</div>
