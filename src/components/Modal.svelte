<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { DialogOverlay, DialogContent } from "svelte-accessible-dialog";

  const dispatch = createEventDispatcher();

  let isOpen = true;
</script>

<style>
  .container {
    margin: 8vh auto;
    width: 650px;
    background-color: var(--in-content-page-background);
    padding: 2rem;
  }

  .modal-body {
    padding: 2rem 0rem;
  }

  .cta {
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    grid-column-gap: 1rem;
  }
</style>

<DialogOverlay {isOpen} onDismiss={() => dispatch('dismiss')}>
  <div
    class="container"
    transition:fly={{ duration: 200, y: 5 }}
    data-svelte-dialog-content
    aria-modal="true"
    role="dialog"
    tabindex="-1">
    <slot name="title">
      <h2>Ion</h2>
    </slot>
    <div class="modal-body">
      <slot name="body">
        <p>I am a dialog</p>
      </slot>
    </div>
    <div class="cta">
      <slot name="cta">
        <button
          class="primary join-button"
          on:click={() => dispatch('accept')}>Accept and Participate</button>
        <button on:click={() => dispatch('cancel')}>Close</button>
      </slot>
    </div>
  </div>
</DialogOverlay>
