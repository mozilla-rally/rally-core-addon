<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { setContext } from "svelte";

import Main from "../../src/routes/Main.svelte";
import { notification } from "../../src/notification-store";

import NotificationCenter from "../../src/routes/NotificationCenter.svelte";

import { get, writable } from 'svelte/store';

const mockStore = (function() {
    const { set, subscribe, update } = writable({availableStudies: []});
    return {
        set,
        subscribe,
        updateStudyEnrollment(studyID, joined) {
            update(state => {
                state.availableStudies = [...state.availableStudies.map(study => {
                    const nextStudy = {...study};
                    if (nextStudy.addonId === studyID) {
                        nextStudy.studyJoined = joined;
                        nextStudy.joinedOn = new Date();
                    }
                    return nextStudy;
                })];
                return state;
            })
        },
        updateDemographicSurvey(results) {
            update(state => {
                return {...state, demographicsData: results};
            })
        }
    }
})();

// add one nicer study with all the information.
const nicerStudy = {
    addonId: 'nicer-study-example@mozilla.org',
    name: "An Example Study",
    authors: {
        name: "Rally Team"
    },
    icons: {
        64: undefined
    },
    endDate: new Date('2021-07-03'),
    tags: ['ad trackers', 'misinformation', 'profiling'],
    privacyPolicy: {spec: 'https://example.com'},

    description: `This is a mock study description. All of the information here is for illustrative purposes only.`,
    dataCollectionDetails: ['page views', 'time and date of joining study', 'etc.'],
    detailsDirectName: "Rally Website",
    detailsDirectLink: '#'
}

fetch('locally-available-studies.json')
    .then(r => r.json())
    .then(s => {
        mockStore.set({...get(mockStore), availableStudies: [nicerStudy, ...s]});
});

setContext("rally:store", mockStore);
setContext("rally:notification", notification);
</script>

<Main />
<NotificationCenter sidebarOffset={true} />
