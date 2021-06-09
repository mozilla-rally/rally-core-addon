<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";
  import ClearAnswerButton from './ClearAnswerButton.svelte';
  import { schema, inputFormatters } from './survey-schema';
  import { questionIsAnswered, clearAnswer,  createResultObject } from './survey-tools';
  import { formatInput, formatAnswersForResponse } from "./formatters";

  export let results = createResultObject(schema);
  export let workingResults = createResultObject(schema, results);
  $: workingResults = createResultObject(schema, workingResults);
  // create the outputted formatted workingResults.
  export let formattedResults = formatAnswersForResponse(schema, workingResults, inputFormatters);
  $: formattedResults = formatAnswersForResponse(schema, workingResults, inputFormatters);
</script>

<style>
  /* this selects only checkbox or radio */
  [class="mzp-c-choice"] {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
  }

  .mzp-c-choice-text {
    min-height: 1rem;
  }

  .mzp-c-field-set-text {
    padding-bottom: 0;
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
    {#each Object.keys(workingResults) as question}
      <fieldset class="mzp-c-field-set" class:mzp-c-field-set-text={schema[question].type === 'text'}>
        <legend class="mzp-c-field-label"
          for={schema[question].key}
          class:remove-bottom-margin={schema[question].sublabel}
        >
          {schema[question].label}
          {#if questionIsAnswered(workingResults[question], schema[question].type)}
            <ClearAnswerButton on:click={(e) => {
              e.preventDefault();
              workingResults[question] = clearAnswer(schema[question].type);
            }} />
          {/if}
        </legend>
        {#if schema[question].sublabel}
        <div style="padding-top: -8px; padding-bottom: 20px;">
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
                inputFormatters.showErrors(question) &&
                inputFormatters.hasValidator(question) &&
                inputFormatters[question].isInvalid(workingResults[question])
            }>
              <input
                type="text"
                use:formatInput={inputFormatters[question]}
                class:right={inputFormatters[question].alignRight}
                on:blur={(event) => { workingResults[question] = event.target.value; }}
                on:focus={(event) => { workingResults[question] = event.target.value; }}
                on:input={(event) => { workingResults[question] = event.target.value; }}
                value={workingResults[question]}
                />
                <span style="min-height: 24px; display: block;">
              {#if 
                  inputFormatters.showErrors(question) && // show errors if blurred
                  inputFormatters.hasValidator(question) && // show errors if there's a validator for this question
                  inputFormatters[question].isInvalid(workingResults[question])
                }
                <span
                  class="mzp-c-fieldnote"
                  transition:fly={{ duration: 300, y: 5 }}>
                  {inputFormatters[question].isInvalid(workingResults[question])}
                </span>
              {/if}
              </span>
            </div>
          {:else}
            {#each schema[question].values as answer}
              <div class="mzp-c-choice">
                {#if schema[question].type === 'single'}
                  <input
                    class="mzp-c-choice-control"
                    type="radio"
                    id="answer-{answer.key}"
                    bind:group={workingResults[question]}
                    value={answer.key} />
                {:else if schema[question].type === 'multi'}
                  <input
                    class="mzp-c-choice-control"
                    type="checkbox"
                    id="answer-{answer.key}"
                    bind:group={workingResults[question]}
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
  <slot name='call-to-action' formattedResults={formatAnswersForResponse(schema, workingResults, inputFormatters)} validated={inputFormatters.validateAllQuestions(schema, workingResults)}></slot>
</div>
