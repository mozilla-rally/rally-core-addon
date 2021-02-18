<script context=module>
import MicroModal from "micromodal";
MicroModal.init({ disableScroll: true, disableFocus: true });
</script>

<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Portal from './Portal.svelte';
  import Close from "./icons/Close.svelte";

  export let width;
  export let height;
  export let topPadding;

  function toVariable(key, value) {
    return value ? `${key}: ${value};` : undefined;
  }

  function addStyleVariables({width, height, topPadding}) {
    const values = [
      toVariable("--width", width), 
      toVariable("--height", height),
      toVariable("--top-padding", topPadding)].filter(d=> d !== undefined);
    if (values.length === 0) return undefined;
    return values.join('; ');
  }

  $: styles = addStyleVariables({width, height, topPadding});

  const dispatch = createEventDispatcher();
  const key =
    `modal-${Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)}`;

  function onCancel() {
    MicroModal.close(key);
    dispatch("cancel");
  }

  function onAccept() {
    MicroModal.close(key);
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

  onMount( () => {
    MicroModal.show(key, { disableScroll: true, disableFocus: true });
  });

  onDestroy(() => {
    MicroModal.close(key);
  });
</script>

<style>
  .overlay {
    --modal-min-height: calc(400px - 40px);
    --top-padding: calc(var(--modal-min-height) / 3);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: var(--top-padding);
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: start;
  }

  h2 {
    font-size: 38px;
  }

  header {
    display: grid;
    grid-template-columns: auto max-content;
  }
  .container {
    width: calc(var(--width, var(--content-width)) - 40px);
    height: calc(var(--height, auto));
    min-width: calc(var(--width, var(--content-width)) - 40px);
    min-height: var(--modal-min-height);
    background-color: var(--color-white);
    padding: 20px;
    box-shadow: var(--box-shadow-lg);
    display: grid;
    grid-template-rows: max-content auto max-content;
    font-size: 14px;
  }

  .cta {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-column-gap: 1rem;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: none;
    line-height: 1;
    width: 40px;
    height: 40px;
    border-radius: 20px;
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

<Portal>
  <div id={key} aria-hidden="true" transition:fade={{ duration: 200 }}>
    <div
      tabindex="-1"
      transition:fly={{duration: 200, y: 5}}
      data-micromodal-close
      class="overlay"
      style={styles}
      on:click={dismissParent}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-1-title"
        class="container radius-sm mzp-t-mozilla">
        <header>
          <h2 class="mzp-t-mozilla">
            <slot name="title">Title.</slot>
          </h2>
          <button on:click={onDismiss}>
            <Close size="28px" />
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
</Portal>
