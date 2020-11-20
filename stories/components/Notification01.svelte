<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import NotificationElement from "../../src/components/notification/NotificationElement.svelte";
  import Check from "../../src/components/icons/Check.svelte";
  import Alert from "../../src/components/icons/Alert.svelte";
  import Button from "../../src/components/Button.svelte";
</script>

<style>
  div {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
    padding: 1rem;
  }
</style>

<div>
  <NotificationElement>
    <span style="display: contents;" slot="icon">
      <Check />
    </span>
    <span slot="body">successfully joined study</span>
  </NotificationElement>

  <NotificationElement level="error">
    <span style="display: contents;" slot="icon">
      <Alert />
    </span>
    <span slot="body">error joining study</span>
    <span slot="cta">
      <Button size="sm" error compact>Try Again</Button>
    </span>
  </NotificationElement>
</div>
