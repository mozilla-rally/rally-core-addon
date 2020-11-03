<script>
  import NotificationBar from "../../src/components/notification/NotificationBar.svelte";
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
  <NotificationBar>
    <span style="display: contents;" slot="icon">
      <Check />
    </span>
    <span slot="body">successfully joined study</span>
  </NotificationBar>

  <NotificationBar level="error">
    <span style="display: contents;" slot="icon">
      <Alert />
    </span>
    <span slot="body">error joining study</span>
    <span slot="cta">
      <Button size="sm" error compact>Try Again</Button>
    </span>
  </NotificationBar>
</div>
