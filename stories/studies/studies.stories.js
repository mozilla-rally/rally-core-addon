/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import StudyCard01 from "./StudyCard01.svelte";
import StudyJoinFlowStory from './StudyJoinFlow.svelte';
export default {
  title: "StudyCard",
};

export const Basic = () => ({
  Component: StudyCard01
});
export const JoinStudyFlow = () => ({
  Component: StudyJoinFlowStory
});
