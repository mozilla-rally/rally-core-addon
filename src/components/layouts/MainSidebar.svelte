<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
</script>

<style>
  .sidebar {
    position: sticky;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: var(--color-light-gray-20);
    width: 15rem;
    padding: 2rem 2.5rem;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: [header] max-content [nav] auto [app] max-content;
    align-content: stretch;
    align-items: start;
    grid-row-gap: 2rem;
    border-right: 1px solid #E1E1E3;
  }
</style>

<div class="sidebar">
  <slot name="header" />
  <slot name="navigation" />
  <slot name="settings" />
</div>
