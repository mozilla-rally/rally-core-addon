import StudyCard01 from "./StudyCard01.svelte";
import InPracticeStory from './InPractice.svelte';
export default {
  title: "StudyCard",
};

export const Basic = () => ({
  Component: StudyCard01
});
export const InPractice = () => ({
  Component: InPracticeStory
});