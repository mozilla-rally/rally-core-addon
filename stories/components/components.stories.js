/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import Dialog01 from './Dialog01.svelte';
import BasicNotificationElementStory from './Notification01.svelte';
import NotificationPositioningStory from './NotificationPositioning.svelte';
import NotificationCenterStory from "./NotificationCenter.svelte";

export default {
    title: "Components",
  };

export const BasicDialog = () => ({
  Component: Dialog01,
});

export const BasicNotificationElement = () => ({
  Component: BasicNotificationElementStory,
});

export const NotificationPositioning = () => ({
  Component: NotificationPositioningStory,
});
export const NotificationCenter = () => ({
  Component: NotificationCenterStory,
});
