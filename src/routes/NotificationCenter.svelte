<script>
	import { notification } from '../notification-store';
    import SuccessfullyJoinedStudyNotification from "./current-studies/SuccessfullyJoinedStudyNotification.svelte";
    import SuccessfullyLeftStudyNotification from "./current-studies/SuccessfullyLeftStudyNotification.svelte";
    import SuccessfullyUpdatedProfileNotification from "./demographics/SuccessfullyUpdatedProfileNotification.svelte";
    
    export let sidebarOffset = false;
    
    const messages = {
        SUCCESSFULLY_JOINED_STUDY: SuccessfullyJoinedStudyNotification,
        SUCCESSFULLY_LEFT_STUDY: SuccessfullyLeftStudyNotification,
        SUCCESSFULLY_UPDATED_PROFILE: SuccessfullyUpdatedProfileNotification
    }
  </script>
  
{#key $notification.id}
    {#if $notification.id}
        <svelte:component this={messages[$notification.code]}
        location={sidebarOffset ? "top-left" : "top"}
        xOffset={sidebarOffset ? "var(--main-notification-offset)" : undefined }
        />
    {/if}
{/key}