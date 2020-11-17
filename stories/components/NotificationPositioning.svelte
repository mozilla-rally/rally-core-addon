<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import OnboardingLayout from '../../src/components/layouts/OnboardingLayout.svelte';
import OnboardingBody from '../../src/components/layouts/OnboardingBody.svelte';
import TOC from '../../src/routes/terms-of-service/Content.svelte';
import NotificationElement from '../../src/components/notification/NotificationElement.svelte';
import Check from '../../src/components/icons/Check.svelte';
import Button from '../../src/components/Button.svelte';

let location = 'bottom';
function setLocation(loc) {
    return () => { location = loc; }
}

let xOffset = 0;
</script>

<style>
.controls {
    position: fixed;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, .7);
    display: grid;
}
</style>


<OnboardingLayout>
    <OnboardingBody>
        <TOC />
    </OnboardingBody>
</OnboardingLayout>

{#key location}
    <NotificationElement location={location} xOffset="{xOffset}px">
        <span style="display: contents;" slot="icon">
        <Check />
        </span>
        <span slot="body">successfully joined study</span>
    </NotificationElement>
{/key}

<div class='controls'>
    <div>
        <input type="range" bind:value={xOffset} min=0 max=200 />
    </div>
    <Button on:click={setLocation('bottom')}>bottom</Button>
    <Button on:click={setLocation('bottom-left')}>bottom-left</Button>
    <Button on:click={setLocation('bottom-right')}>bottom-right</Button>
    <Button on:click={setLocation('top')}>top</Button>
    <Button on:click={setLocation('top-left')}>top-left</Button>
    <Button on:click={setLocation('top-right')}>top-right</Button>
</div>