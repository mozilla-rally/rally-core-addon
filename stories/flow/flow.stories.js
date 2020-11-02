import WelcomeView from './WelcomeView.svelte';
import TermsView from './TermsView.svelte';
import DemographicsView from './DemographicsView.svelte';
import OnboardingFlowView from './OnboardingFlowView.svelte'

export default {
    title: "Core Add-On Onboarding Flow",
  };

export const WelcomeFirstRun = () => ({
  Component: WelcomeView,
  props: { firstRun: true },
  on: {
      "get-started": () => console.log('get started clicked')
  }
});

WelcomeFirstRun.storyName = "1a. Welcome (first run)"

export const Welcome = () => ({
  Component: WelcomeView,
  on: {
      "get-started": () => console.log('get started clicked')
  }
});
Welcome.storyName = "1b. Welcome (revisit)";

export const Terms = () => ({
    Component: TermsView
})
Terms.storyName = "2. Terms of Service";

export const Demographics = () => ({
  Component: DemographicsView
})
Demographics.storyName = "3. Demographics Survey";

export const OnboardingFlow = () => ({
  Component: OnboardingFlowView
})