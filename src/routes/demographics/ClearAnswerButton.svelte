<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { fly } from 'svelte/transition';
  import Close from '../../components/icons/Close.svelte';
</script>

<style>
/*
    Because this button's styling deviates a bit from the protocol buttons,
    we will special-case this for now and build off the protocol styles.
    Down the line, if this button style should be reused, we can
    move this into Button.svelte with an appropriate variant name.
*/
button.mzp-t-sm.mzp-c-button.mzp-t-neutral.mzp-t-product {
    display: inline-grid;
    grid-column-gap: 6.66px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4.5px;
    padding-bottom: 5.5px;
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    margin-left: 12px;
    /* protocol seems to insert a 1px margin that
        shifts the survey questions when the button appears.
        This margin correction prevents that shift. */
    margin-bottom: -1px;
}
</style>

<button transition:fly={{duration:150, y: 2.5}} class="gafc mzp-t-sm mzp-c-button mzp-t-neutral mzp-t-product" on:click>
    <Close /> Clear this response
</button>