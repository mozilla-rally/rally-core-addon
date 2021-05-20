/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
        // create response entry here.
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

