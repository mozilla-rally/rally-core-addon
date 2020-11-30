<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
export let text = false;
export let error = false;

// create an error store so children can report
// up errors.
const sharedError =  writable({});
setContext('rally::survey::choice::errors', sharedError);
</script>

<style>
.mzp-c-choice {
    padding-bottom: 8px;
}
</style>

<div class="mzp-c-choice" class:mzp-c-choice-text={text} class:mzp-is-error={error || !Object.values($sharedError).every(t => t)}>
    <slot></slot>
</div>