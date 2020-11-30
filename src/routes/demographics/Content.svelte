<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly, slide } from "svelte/transition";
  import Question from '../../components/form/Question.svelte';
  import Choice from '../../components/form/Choice.svelte';
  import Single from '../../components/form/Single.svelte';
  import Multi from '../../components/form/Multi.svelte';
  import Text from '../../components/form/Text.svelte';
  import Label from '../../components/form/Label.svelte';
  import ClearAnswerButton from './ClearAnswerButton.svelte';

  function zipcodeIsValid() {
    return function zipcodeValid(value) {
      if (Number.isNaN(Number(value)) || value.length > 5)
        return "Please enter a five-digit zip code.";
      else return true;
    };
  }

  // add survey schema here.
  const schema = {
    age: {
      key: "age",
      label: "1. What is your age?",
      type: "single",
      columns: true,
      values: [
        { key: "19-24", label: "19-24 years old" },
        { key: "25-34", label: "25-34 years old" },
        { key: "35-44", label: "35-44 years old" },
        { key: "45-54", label: "45-54 years old" },
        { key: "55-64", label: "55-64 years old" },
        { key: "> 65", label: "65 years and older" },
      ],
    },
    gender: {
      key: "gender",
      label: "2. What is your gender?",
      type: "single",
      columns: true,
      values: [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "neither", label: "Neither choice describes me", 
          progressiveDisclosure: true,
          where: 'after question',
          values: {
            type: 'text',
            label: "How would you describe your gender?"
          }
        },
        { key: "decline", label: "Decline to identify" },
      ],
    },
    hispanicLatinoSpanishOrigin: {
      key: "hispanicLatinoSpanishOrigin",
      label: "3. Are you of Hispanic, Latino, or Spanish origin?",
      type: "single",
      values: [
        { key: "no", label: "No, not of Hispanic, Latino, or Spanish origin" },
        { key: "yes", label: "Yes" },
      ],
    },
    race: {
      key: "race",
      label: "4. What is your race?",
      type: "multi",
      columns: true,
      values: [
        { 
          key: "white", label: "White",
          progressiveDisclosure: true,
          where: 'after option',
          values: {
            type: 'text'
          }
        },
        {
          key: "american_indian_or_alaska_native",
          label: "American Indian or Alaska Native",
        },
        { key: "chinese", label: "Chinese" },
        { key: "filipino", label: "Filipino" },
        { key: "asian_indian", label: "Asian Indian" },
        { key: "vietnamese", label: "Vietnamese" },
        { key: "korean", label: "Korean" },
        { key: "japanese", label: "Japanese" },
        {
          key: "black_or_african_american",
          label: "Black or African American",
        },
        { key: "native_hawaiian", label: "Native Hawaiian" },
        { key: "samoan", label: "Samoan" },
        { key: "chamorro", label: "Chamorro" },
        { key: "other_pacific_islander", label: "Other Pacific Islander" },
        { key: "some_other_race", label: "Some other race" },
      ],
    },

    school: {
      key: "school",
      label: "5. What is the highest level of school you have completed?",
      type: "single",
      values: [
        { key: "less_than_high_school", label: "Less than high school" },
        { key: "some_high_school", label: "Some high school" },
        {
          key: "high_school_graduate_or_equivalent",
          label: "High school grduate or equivalent (for example GED)",
        },
        {
          key: "some_college_but_no_degree_or_in_progress",
          label: "Some college, but degree not received or in progress",
        },
        {
          key: "associates_degree",
          label: "Associate's degree (for example AA, AS)",
        },
        {
          key: "bachelors_degree",
          label: "Bachelor's degree (for example BA, BS, BB)",
        },
        {
          key: "graduate_degree",
          label:
            "Graduate degree (for example master's, professional, doctorate)",
        },
      ],
    },
    income: {
      key: "income",
      label:
        "6. What is your household's combined annual income during the past 12 months?",
      type: "single",
      columns: 3,
      values: [
        { key: "0-24999", label: "$0 - $24,999" },
        { key: "25000-49999", label: "$25,000 - $49,999" },
        { key: "50000-74999", label: "50,000 - $74,999" },
        { key: "75000-99999", label: "$75,000 - $99,999" },
        { key: "100000-149999", label: "$100,000 - $149,999" },
        { key: ">= 150000", label: "$150,000 or more" },
      ],
    },
    zipcode: {
      key: "zipcode",
      label: "7. What is your zip code?",
      type: "text",
    },
  };

  export let results = Object.values(schema).reduce((acc, config) => {
    acc[config.key] = {};
    if (config.type === 'text') acc[config.key].input = '';
    return acc;
  }, {});

  function questionIsAnswered(answer, questionType) {
    if (questionType === 'text') return answer.input.length > 0;
    return !(Object.keys(answer).length === 0 && answer.constructor === Object);
  }
</script>

<style>
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
  <h2 class='section-header'>Your Data Profile</h2>

  <p style="font-style: italic;">
    This anonymously collected information will be used by researchers to understand how different people are exposed to the web in different ways.
  </p>

  <hr />

  <form class="mzp-c-form">
    {#each Object.keys(results) as question}
      <fieldset class="mzp-c-field-set">
        <Question key={schema[question].key}>
          {schema[question].label}
          {#if questionIsAnswered(results[question], schema[question].type)}
            <ClearAnswerButton on:click={(e) => {
              e.preventDefault();
              results[question] = {};
              if (schema[question].type === 'text') results[question].input = '';
            }} />
          {/if}
        </Question>
        <div
          class="mzp-c-choices"
          class:two-columns={schema[question].columns}
          style="--rows: {schema[question].values ? Math.ceil(schema[question].values.length / 2) : 0};">
          {#if schema[question].type === 'text'}
          <Choice>
            <Text 
              validators={[zipcodeIsValid()]}
              value={results[question].input}
              on:input={(evt) => { results[question].input = evt.target.value; }}
            />
          </Choice>
          {:else}
            {#each schema[question].values as answer}
                <Choice>
                  {#if schema[question].type === 'single'}
                    <Single 
                      value={answer.key}
                      checked={results[question][answer.key]}
                      on:click={() => { 
                        results[question] = { [answer.key]: true }; 
                        if (answer.progressiveDisclosure) results[question][`${answer.key}-freeform`] = '';
                      }}
                    />
                  {:else}
                    <Multi
                      value={answer.key}
                      checked={results[question][answer.key]}
                      on:click={() => {
                        if (answer.key in results[question]) {
                          delete results[question][answer.key];
                          if (answer.progressiveDisclosure) {
                            delete results[question][`${answer.key}-freeform`];
                          }
                          // trigger update for Svelte.
                          // This is an unfortunate issue where
                          // the delete keyword is not watched but
                          // the assignment is.
                          results[question][answer.key] = results[question][answer.key];
                        }
                        else {
                          if (answer.progressiveDisclosure) results[question][`${answer.key}-freeform`] = '';
                          results[question][answer.key] = true;
                        }
                      }} />
                  {/if}
                  <Label value={answer.key}>
                    {answer.label}
                  </Label>
              </Choice>
              <!-- post-option progressive disclosures -->
              {#if answer.progressiveDisclosure && answer.where === 'after option' && results[question][answer.key]}
              <div transition:slide>
                <Choice>
                  <Text 
                    value={results[question][`${answer.key}-freeform`]}
                    on:input={(evt) => {
                      results[question][`${answer.key}-freeform`] = evt.target.value;
                    }}
                   />
                </Choice>
              </div>
              {/if}
            {/each}
            <!-- post-question progressive disclosures go here -->
          {/if}
        </div>
      </fieldset>
    {/each}
  </form>
</div>
