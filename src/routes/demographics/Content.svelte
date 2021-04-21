<script>
import { tick } from "svelte";

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";
  import ClearAnswerButton from './ClearAnswerButton.svelte';
  import schema from './survey-schema';
  import { questionIsAnswered, clearAnswer,  createResultObject, inputFormatters } from './survey-tools';

  export let results = createResultObject(schema);
</script>

<style>
  /* this selects only checkbox or radio */
  [class="mzp-c-choice"] {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
  }

  .mzp-c-field-label.remove-bottom-margin {
    padding-bottom: 0;
  }

  .mzp-c-choice {
    padding-bottom: 8px;
  }

  .mzp-c-choice-label {
    font-weight: normal;
    font-size: 1rem;
  }

  label,
  input {
    cursor: pointer;
  }

  input[type="text"] {
    cursor: auto;
    border: 2px solid #CDCDD4;
    width: 140px;
    min-width: 140px;
    transition: border-color 200ms;
  }

  input[type="text"].right {
    text-align: right;
  }
  input[type="text"]:focus {
    border-color: #0250bb;
    box-shadow: 0 0 0 2px #0250bb;
  }
  .mzp-is-error input[type="text"] {
    border: 2px solid #D70022;
    color: #D70022;
  }

  .mzp-is-error input[type="text"]:focus {
    box-shadow: 0 0 0 2px #D70022;
  }

  .mzp-c-choice-control[type="radio"] + label,
  .mzp-c-choice-control[type="checkbox"] + label {
    margin-left: 0.5rem;
  }

  /* correct for Protocol's radio and checkbox misalignments */
  .mzp-c-choice-control[type="radio"] + label::before {
    transform: translateY(0.25rem);
  }

  .mzp-c-choice-control[type="checkbox"] + label::before {
    transform: translateY(0.25rem);
  }

  .mzp-c-choice-control[type="checkbox"]:checked + label::after {
    transform: translateY(0.215rem) rotate(45deg);
  }

  legend {
    color: var(--color-ink-50);
    font-size: 1rem;
  }

  fieldset {
    /* position: inherit; */
    padding-bottom: 60px;
  }

  fieldset:last-child {
    padding-bottom: 0;
  }

  .mzp-c-choices {
    width: 100%;
    padding-bottom: 0;
    padding-left: 1rem;
  }

  .two-columns {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: max-content max-content;
    grid-template-rows: repeat(var(--rows, 3), max-content);
    justify-content: start;
    width: max-content;
    grid-column-gap: 4rem;
  }
</style>

<div in:fly={{ duration: 800, y: 5 }}>
  <h2 class='section-header'>
    <slot name="title">
      <span>Tell Us About Yourself</span>
    </slot>
  </h2>

  <slot name="description">
    <p>
      Each question is completely optional, and can be updated at any time by clicking Manage Profile. 
      The answers you give will help us understand the composition and representivity of the Rally community.
      Additionally, collaborators will combine your answers with the data collected in the studies you join to enrich their findings and answer research questions.
    </p>
  </slot>

  <hr />

  <form class="mzp-c-form">
    {#each Object.keys(results) as question}
      <fieldset class="mzp-c-field-set">
        <legend class="mzp-c-field-label"
          for={schema[question].key}
          class:remove-bottom-margin={schema[question].sublabel}
        >
          {schema[question].label}
          {#if questionIsAnswered(results[question], schema[question].type)}
            <ClearAnswerButton on:click={(e) => {
              e.preventDefault();
              results[question] = clearAnswer(schema[question].type);
            }} />
          {/if}
        </legend>
        {#if schema[question].sublabel}
        <div style="padding-top: -8px; padding-bottom: 8px;">
          {schema[question].sublabel}
        </div>
      {/if}

        <div
          class="mzp-c-choices"
          class:two-columns={schema[question].columns}
          style="--rows: {schema[question].values ? Math.ceil(schema[question].values.length / 2) : 0};">
          {#if schema[question].type === 'text'}
            <div
              class="mzp-c-choice mzp-c-choice-text"
              class:mzp-is-error={
                inputFormatters.showErrors(question) && // only show errors if explicitly told, e.g. on blur
                inputFormatters.hasValidator(question) && // only show errors if there's even a validator
                inputFormatters[question].isInvalid(results[question] // only show errors if the input is invalid
            )}>
              <input
                type="text"
                class:right={inputFormatters[question].alignRight}
                on:blur={(event) => {
                  if (inputFormatters[question] && inputFormatters[question].blur) {
                    results[question] = inputFormatters[question].blur(event);
                  }
                }}
                on:focus={(event) => {
                  if (inputFormatters[question] && inputFormatters[question].focus) {
                    results[question] = inputFormatters[question].focus(event);
                  }
                }}
                on:input={async (event) => {
                  let value;
                  if (inputFormatters[question] && inputFormatters[question].input) {
                    value = inputFormatters[question].input(event);
                    event.target.value = value;
                  } else {
                    value = event.target.value;
                  }
                  
                  results[question] = value;
                  await tick();
                }}
                value={results[question]}
                />
                <span style="min-height: 24px; display: block;">
              {#if 
                  inputFormatters.showErrors(question) && // show errors if blurred
                  inputFormatters.hasValidator(question) && // show errors if there's a validator for this question
                  inputFormatters[question].isInvalid(results[question])
                }
                <span
                  class="mzp-c-fieldnote"
                  transition:fly={{ duration: 300, y: 5 }}>
                  {inputFormatters[question].isInvalid(results[question])}
                </span>
              {/if}
              </span>
              <!-- show validation errors here -->
              <!-- <span style="min-height: 24px; display: block;">
                {#if $zipValidity.dirty && !$zipValidity.valid}
                  <span
                    class="mzp-c-fieldnote"
                    transition:fly={{ duration: 300, y: 5 }}>
                    {$zipValidity.message}
                  </span>
                {/if}
              </span> -->
            </div>
          {:else}
            {#each schema[question].values as answer}
              <div class="mzp-c-choice">
                {#if schema[question].type === 'single'}
                  <input
                    class="mzp-c-choice-control"
                    type="radio"
                    id="answer-{answer.key}"
                    bind:group={results[question]}
                    value={answer.key} />
                {:else if schema[question].type === 'multi'}
                  <input
                    class="mzp-c-choice-control"
                    type="checkbox"
                    id="answer-{answer.key}"
                    bind:group={results[question]}
                    value={answer.key} />
                {/if}
                <label class="mzp-c-choice-label" for="answer-{answer.key}">
                  {answer.label}
                </label>
              </div>
            {/each}
          {/if}
        </div>
      </fieldset>
    {/each}
  </form>
  <!-- Add a slot to aid in  -->
  <slot name='call-to-action' results={results} validated={inputFormatters.validateAllQuestions(schema, results)}></slot>
</div>
