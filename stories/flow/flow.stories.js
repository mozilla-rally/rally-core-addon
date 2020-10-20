import WelcomeView from './WelcomeView.svelte';
import TermsView from './TermsView.svelte';

export default {
    title: "Core Add-On Onboarding Flow",
  };
  
  export const Welcome = () => ({
    Component: WelcomeView,
    on: {
        "get-started": () => console.log('get started clicked')
    }
  });

  export const Terms = () => ({
      Component: TermsView
  })