<script>
  import { writable } from "svelte/store";
  import { fly } from "svelte/transition";

  function zipcodeIsValid() {
    return function zipcodeValid(value) {
      if (Number.isNaN(Number(value)) || value.length > 5)
        return "Please enter a five-digit zip code.";
      else return true;
    };
  }

  function buildValidator(validators) {
    return function validate(value, dirty) {
      if (!validators || validators.length === 0) {
        return { dirty, valid: true };
      }

      const failing = validators.find((v) => v(value) !== true);
      return {
        dirty,
        valid: !failing,
        message: failing && failing(value),
      };
    };
  }

  export function createFieldValidator(...validators) {
    const { subscribe, set } = writable({
      dirty: false,
      valid: false,
      message: null,
    });
    const validator = buildValidator(validators);

    function action(node, binding) {
      function validate(value, dirty) {
        const result = validator(value, dirty);
        set(result);
      }

      validate(binding, false);

      return {
        update(value) {
          validate(value, true);
        },
      };
    }

    return [{ subscribe }, action];
  }

  const [zipValidity, validateZip] = createFieldValidator(zipcodeIsValid());

  // add survey schema here.
  const schema = {
    age: {
      key: "age",
      label: "1. What is your age?",
      type: "multi",
      columns: true,
      values: [
        { key: "19-24", label: "19-24 years old" },
        { key: "25-34", label: "25-34 years old" },
        { key: "35-44", label: "35-44 years old" },
        { key: "45-54", label: "45-54 years old" },
        { key: "55-64", label: "55-64 years old" },
        { key: "> 65", label: "65 years and older" },
      ],
      type: "single",
    },
    gender: {
      key: "gender",
      label: "2. What is your gender?",
      type: "single",
      columns: true,
      values: [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "neither", label: "Neither choice describes me" },
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
        { key: "white", label: "White" },
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
    let defaultValue = undefined;
    switch (config.type) {
      case "single": {
        defaultValue = undefined;
        break;
      }
      case "multi": {
        defaultValue = [];
        break;
      }
      case "text": {
        defaultValue = "";
        break;
      }
      default:
        break;
    }

    acc[config.key] = defaultValue;
    return acc;
  }, {});
</script>

<style>
  /* this selects only checkbox or radio */
  [class="mzp-c-choice"] {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
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
    padding-bottom: 0px;
  }

  .mzp-c-choices {
    width: 100%;
    padding-bottom: 0px;
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
  <h2>Let's set up your profile</h2>

  <p>
    Don’t worry, it’s completely annonymous; it’s used by researchers to lorem
    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
    incididunt ut.
  </p>

  <hr />

  <form class="mzp-c-form">
    {#each Object.keys(results) as question}
      <fieldset class="mzp-c-field-set">
        <legend class="mzp-c-field-label" for={schema[question].key}>
          {schema[question].label}
        </legend>

        <div
          class="mzp-c-choices"
          class:two-columns={schema[question].columns}
          style="--rows: {schema[question].values ? Math.ceil(schema[question].values.length / 2) : 0}">
          {#if schema[question].type === 'text'}
            <div
              class="mzp-c-choice mzp-c-choice-text"
              class:mzp-is-error={!$zipValidity.valid}>
              <input
                use:validateZip={results[question]}
                type="text"
                bind:value={results[question]} />
              {#if $zipValidity.dirty && !$zipValidity.valid}
                <span
                  class="mzp-c-fieldnote"
                  transition:fly={{ duration: 300, y: 5 }}>
                  {$zipValidity.message}
                </span>
              {/if}
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
</div>
