<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This component is used in the "Main View" of the Rally Add-On.
import { getContext, createEventDispatcher } from "svelte";
import Demographics from "./Content.svelte";
import Button from "../../components/Button.svelte";

const store = getContext('rally:store');
const dispatch = createEventDispatcher();
// Create a deep copy of $store.demographicsData for the "manage profile" view.
// Only update the store when the submit button is explicitly clicked;
// update the intermediate copy when $store.demographicsData changes.
let intermediateResults;
$: if ($store && $store.demographicsData) intermediateResults = { ...$store.demographicsData };
</script>

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
                store.updateDemographicSurvey(results);
                dispatch("profile-updated", true);
            }}>Save Changes</Button>
            <Button size="lg" product disabled={!validated} secondary on:click={() => {
                intermediateResults = $store.demographicsData;
                dispatch("profile-updated", false);
            }}>Cancel</Button>
        </div>
    </div>
</Demographics>
