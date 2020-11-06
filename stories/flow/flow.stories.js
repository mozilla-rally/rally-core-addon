/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

WelcomeFirstRun.storyName = "1a. Welcome (first run)";

export const Welcome = () => ({
  Component: WelcomeView,
  on: {
    "get-started": () => console.log('get started clicked')
  }
});
Welcome.storyName = "1b. Welcome (revisit)";

export const Terms = () => ({
  Component: TermsView
});
Terms.storyName = "2. Terms of Service";

export const Demographics = () => ({
  Component: DemographicsView
});
Demographics.storyName = "3. Demographics Survey";

export const OnboardingFlow = () => ({
  Component: OnboardingFlowView
});
