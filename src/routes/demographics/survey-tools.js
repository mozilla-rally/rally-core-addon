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
