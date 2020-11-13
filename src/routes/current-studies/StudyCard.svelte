<script> 
 /* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/* 
    NOTE: this is a full pattern integration of the study card. It uses the StudyCard, StudyCardHeader,
    and dialog components. This is the component to use _in practice_.

    It relies on props instead of props to reduce the cost of use.
*/

import { createEventDispatcher } from 'svelte';
import StudyCard from '../../components/study-card/StudyCard.svelte';
import StudyCardHeader from '../../components/study-card/Header.svelte';
import Button from '../../components/Button.svelte';
import Dialog from '../../components/Dialog.svelte';

export let joined = false;
export let imageSrc;
export let title = "Untitled Study";
export let author = "Author Unknown";
export let description = "no description.";
export let endDate;
export let joinedDate;
export let dataCollectionDetails;
export let privacyPolicyLink;
export let tags;
export let detailsDirectName;
export let detailsDirectLink;
export let joinStudyConsentNotice;
export let leaveStudyConsentNotice;

const dispatch = createEventDispatcher();

let joinModal = false;

</script>

<StudyCard
    {joined}
    on:join={() => {
    joinModal = true;
    }}
    on:leave={() => {
    joinModal = true;
    }}
    {endDate}
    {joinedDate}
    {dataCollectionDetails}
    {tags}
    {imageSrc}
    {privacyPolicyLink}>
        <span slot="name">{title}</span>
        <span slot="author">{author}</span>
        <p slot="description">
        {description}
        </p>
        <div slot="details" style="display: {(detailsDirectName !== undefined && detailsDirectLink !== undefined) ? 'auto' : 'none'};">
        {#if detailsDirectName && detailsDirectLink}
            Full study details can be found on the
            <a href={detailsDirectLink}>{detailsDirectName}</a>
        {/if}
        </div>
</StudyCard>

{#if joinModal}
    <Dialog
    on:dismiss={() => {
        joinModal = false;
    }}>
    <!-- override the dialog Zilla font setting. -->
    <div slot="title">
        {#if !joined}
        <StudyCardHeader endDate={new Date(2020, 5, 5)}>
            <img
            slot="study-icon"
            class="study-card-image"
            width="60"
            alt="study icon"
            src={imageSrc || "/default-study-icon.png"} />
            <span slot="study-name">{title}</span>
            <span slot="study-author">{author}</span>
        </StudyCardHeader>
        {:else}Leave this Study?{/if}
    </div>
    <div style="padding-bottom: 90px;" slot="body">
        {#if !joined}
        {#if joinStudyConsentNotice}
            {@html joinStudyConsentNotice}
        {:else}
        <!-- default "join study" consent notice -->
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, ut enim ad minim veniam, ut enim ad minim
            veniam.
            </p>
            <p>TBD approach based on explorations with SimplySecure.</p>
        {/if}
        {:else}
        {#if leaveStudyConsentNotice}
            {@html leaveStudyConsentNotice}
        {:else}
        <!-- default "leave study" consent notice -->
        What does it mean to leave
        <ul>
            <li>You will no longer share any data with our platform</li>
            <li>You’ll be removed from any active studies</li>
            <li>We’ll delete your data?</li>
        </ul>
        {/if}
        {/if}
    </div>
    <div slot="cta">
        <Button
        size="lg"
        product
        leave={joined}
        on:click={() => {
            joined = !joined;
            // send event to parent.
            dispatch(joined ? "join" : "leave");
            joinModal = false;
        }}>
        {#if joined}Leave Study{:else}Join Study{/if}
        </Button>
        <Button
        size="lg"
        product
        secondary
        on:click={() => {
            joinModal = false;
        }}>
        Cancel
        </Button>
    </div>
    </Dialog>
{/if}