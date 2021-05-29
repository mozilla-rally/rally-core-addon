/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function createResultObject(schema, currentAnswers) {
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
        // create response entry here.
        let answer;
        if (currentAnswers && currentAnswers[config.key] !== undefined) {
          answer = currentAnswers[config.key];
        } else {
          answer = defaultValue;
        }
        acc[config.key] = answer;
        return acc;
      }, {});
}

export function questionIsAnswered(answer, questionType) {
  if (answer === undefined) return false;
  if (questionType === 'text') return answer.length > 0;
  if (questionType === 'single') return answer !== undefined;
  if (questionType === 'multi') return answer.length > 0;
  throw Error('unknown question type');
}

/**
 * Clears the display version of the answer.
 * @param {string} questionType the question type (one of text, single, or multi)
 * @returns {string || undefined || []} 
 */
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

