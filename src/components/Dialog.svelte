<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Close from "./icons/Close.svelte";
  import MicroModal from "micromodal";

  const dispatch = createEventDispatcher();

  function onCancel() {
    MicroModal.close("#modal-1");
    dispatch("cancel");
  }

  function onAccept() {
    MicroModal.close("#modal-1");
    dispatch("accept");
  }

  function onDismiss() {
    dispatch("dismiss");
  }

  function dismissParent(e) {
    if (e.target === e.currentTarget) onDismiss();
  }

  function handleKeydown(e) {
    if (e.key === "Escape") onDismiss();
  }

  onMount(async () => {
    MicroModal.init({ disableScroll: true, disableFocus: true });
    MicroModal.show("modal-1", { disableScroll: true, disableFocus: true });
  });

  onDestroy(() => {
    MicroModal.close("modal-1");
  });
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  header {
    display: grid;
    grid-template-columns: auto max-content;
  }
  .container {
    margin: 8vh auto;
    width: 580px;
    background-color: var(--color-white);
    padding: 20px;
    padding-top: 30px;
    box-shadow: var(--box-shadow-lg);
  }

  .modal-body {
    padding: 2rem 0rem;
  }

  .cta {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-column-gap: 1rem;
  }

  button {
    padding: 0px;
    background-color: transparent;
    border: none;
    line-height: 1;
    width: 1.5em;
    height: 1.5em;
    border-radius: 1em;
    transition: transform 500ms, color 500ms;
    color: #1d1133;
    cursor: pointer;
  }

  button:hover {
    transform: rotate(360deg);
    color: black;
  }
</style>

<svelte:window on:keydown={handleKeydown} />

<div id="modal-1" aria-hidden="true" transition:fade={{ duration: 200 }}>
  <div
    tabindex="-1"
    data-micromodal-close
    class="overlay"
    on:click={dismissParent}>
    <div
      transition:fly={{ duration: 200, y: 5 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-1-title"
      class="container radius-sm mzp-t-mozilla">
      <header>
        <h2 class="mzp-t-mozilla">
          <slot name="title">Title.</slot>
        </h2>
        <button on:click={onDismiss}>
          <Close />
        </button>
      </header>

      <div class="modal-body">
        <slot name="body">
          <p>I am a dialog</p>
        </slot>
      </div>
      <!-- [4] -->
      <div class="cta">
        <slot name="cta">
          <button on:click={onAccept}>Accept</button>
          <button on:click={onCancel}>Cancel</button>
        </slot>
      </div>
    </div>
  </div>
</div>
