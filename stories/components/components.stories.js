import Dialog01 from './Dialog01.svelte';
import Notification01 from './Notification01.svelte'

export default {
    title: "Components",
  };

export const BasicDialog = () => ({
  Component: Dialog01,
});

export const BasicNotification = () => ({
  Component: Notification01,
});