/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { writable } from 'svelte/store';

export function createResultObject(schema) {
    return Object.values(schema).reduce((acc, config) => {
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
}

export function questionIsAnswered(answer, questionType) {
    if (questionType === 'text') return answer.length > 0;
    if (questionType === 'single') return answer !== undefined;
    if (questionType === 'multi') return answer.length > 0;
    throw Error('unknown question type');
}

export function clearAnswer(questionType) {
  switch (questionType) {
    case "text": {
      return '';
    } case "single": {
      return undefined;
    } case "multi": {
      return [];
    } default: {
      throw Error('question must have a type');
    }
  }
}

export function zipcodeIsValid() {
  return function zipcodeValid(value) {
    if (Number.isNaN(Number(value)) || value.length > 5)
      return "Please enter a five-digit zip code.";
    else return true;
  };
}

export function incomeIsValid() {
  return function incomeValid(value) {
    const number = Number(value)
    if (Number.isNaN(number) && number >= 0) {
      return "basic text"
    }
  }
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

function formatIncomeInput(event) {
  const r = /^\d/;
  return event.target.value.split('').filter(a => r.test(a)).join('');
}

function formatZipcodeInput(event) {
  const r = /^\d/;
  return event.target.value.split('').filter(a => r.test(a)).join('').slice(0,5);
}

/**
 * Formatters for free-text questions that require (1) formatting and (2) validation.
 */
export const inputFormatters = {
  validateAllQuestions(schema, answers) {
    return Object.keys(schema).every(key => {
      if (!this.hasValidator(key)) return true;
      return this.hasValidator(key) && !this[key].isInvalid(answers[key]);
    })
  },
  exists(key) {
    return (key in this);
  },
  has(key, functionName) {
    return (this.exists(key) && functionName in this[key])
  },
  hasValidator(key) {
    return this.has(key, 'isInvalid');
  },
  showErrors(key) {
    return this[key].showValidationErrors;
  },
  hasInput(key) {
    return this.has(key, 'input');
  },
  hasBlur(key) {
    return this.has(key, 'blur');
  },
  hasFocus(key) {
    return this.has(key, 'focus');
  },
  // the individual question validators
  zipcode: {
    alignRight: false,
    showValidationErrors: false,
    input: formatZipcodeInput,
    blur(event) {
      const value = formatZipcodeInput(event);
      this.showValidationErrors = true;
      return value;
    },
    focus(event) {
      const value = formatZipcodeInput(event);
      this.showValidationErrors = false;
      return value;
    },
    isInvalid(text) {
      const number = Number(text);
      if (text.length > 0 && text.length < 5) return 'zipcode must be a five-digit number';
      if (Number.isNaN(number)) return 'zipcode must be a five-digit number';
      return false;
    }
  },
  // free-text formatters for the income question
  income: {
    alignRight: true,
    showValidationErrors: false,
    isInvalid(text) {
      return false;
    },
    input: formatIncomeInput,
    blur(event) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
      const value = formatIncomeInput(event);
      this.showValidationErrors = true;
      return formatter.format(value);

    },
    focus: formatIncomeInput
  }
}


