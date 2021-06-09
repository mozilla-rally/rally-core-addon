/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { questionIsAnswered } from "./survey-tools.js";

 /** This Svelte action will format an input element on input, focus, and blur events. 
  * It takes in a formatter below of type FieldFormatter.
 */
export function formatInput(node, formatter) {
    function input(event) {
      event.target.value = formatter.edit(event.target.value);
    }
    function focus(event) {
      event.target.value = formatter.edit(event.target.value);
    }

    function blur(event) {
      event.target.value = formatter.display(event.target.value);
    }
    if (formatter) {
      node.addEventListener('input', input);
      node.addEventListener('focus', focus);
      node.addEventListener('blur', blur);
      if (formatter.alignRight) {
        node.classList.add('right');
      }
    }
    
    return {
      destroy() {
        if (formatter) {
          node.classList.remove('right');
          node.removeEventListener('input', input);
          node.removeEventListener('focus', focus);
          node.removeEventListener('blur', blur);
        }
      }
    }
  }

/**
 * Formatters for free-text questions that require (1) formatting and (2) validating the values entred in,
 * usually on blur.
 */

// a FieldFormatter instance has a blur, focus, and input callback.
// it will manage some state to tell the system when to show the invalid state.
// it also has an isInvalid function that should return true whenever the value is invalid.

export class FieldFormatter {
    constructor(parameters = {}) { 
      this.alignRight = !!parameters.alignRight || false;
      this.showValidationErrors = false; 
    }
  
    /** The validator function tells us if an input is valid. */
    setValidator(callback) {
      this.isInvalid = callback;
    }
  
    /** We use this formatter when we begin editing an input element.
     * This is typically used on the input and focus events.
     */
    formatForEditing(callback) {
      this.edit =(value) => {
        // show the validation errors for this while blurred.
        this.showValidationErrors = false;
        return callback(value);
      }; 
    }
  
    /** We use this formatter when we are ready to display the number
     * back to the user. This is typically used on the blur event.
     */
    formatForDisplay(callback) {
      this.display = (value) => {
        // hide the validation errors for this while focused.
        this.showValidationErrors = true;
        return callback(value);
      }; 
    }
  
    /** We use this formatter when we are transforming the input text
     * into the final response required by the schema.
     * Unlike the others, the callback should take a value as an argument,
     * not an event.
     */
    formatForResponse(callback) {
      this.response = callback;
    }
  }
    
  export function currencyFormatter() {
    const formatCurrencyInput = (value) => {
      if (value === undefined) {
        return '';
      }
      const r = /^\d/;
      return value.split('').filter(a => r.test(a)).join('');
    }
    
    const currency = new FieldFormatter({ alignRight: true });
    
    currency.formatForDisplay((value) => {
      let intermediateValue = value;
      // handle the v1 schema and transform it to an empty string.
      // Note: this handling will not scale over time.
      if (typeof intermediateValue === 'string' && intermediateValue.includes('_')) {
        return '';
      }
      // handle the case of the response value being a number that neesd to be 
      // turned into a number-string first.
      if (typeof intermediateValue === 'number') {
        intermediateValue = (Math.floor(intermediateValue)).toString();
      } else if (typeof intermediateValue !== 'string') {
        // Reset the intermediate value to be an empty string in this case.
        // This will reset any non-standard or previous schema type response value
        // for this field.
        intermediateValue = '';
      }
      const toCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
      // strip the current input of any non-numerics.
      const finalValue = formatCurrencyInput(intermediateValue);
      // don't display any currency if the string is empty
      return finalValue.length ? toCurrency.format(finalValue) : '';
    })
  
    currency.formatForEditing(formatCurrencyInput);
  
    currency.formatForResponse((value) => {
      return value.length ? +formatCurrencyInput(value) : undefined;
    })
  
    return currency;
  }
  
  export function zipcodeFormatter() {
    const formatZipcodeInput = (value) => {
      if (value === undefined) {
        return '';
      }
      const r = /^\d/;
      return value.split('').filter(a => r.test(a)).join('').slice(0,5);
    }
    
    const zipcode = new FieldFormatter({ alignRight: false });
  
    zipcode.formatForDisplay(formatZipcodeInput);
    zipcode.formatForEditing(formatZipcodeInput);
    zipcode.formatForResponse(formatZipcodeInput);
    zipcode.setValidator((text) => {
        if (text === undefined) return false;
        const number = Number(text);
        if (text.length > 0 && text.length < 5) return 'zipcode must be a five-digit number';
        if (Number.isNaN(number)) return 'zipcode must be a five-digit number';
        return false;
      });
    return zipcode;
  }
  
  export const formatters = {
    currency: currencyFormatter,
    zipcode: zipcodeFormatter
  }
  
export function createInputFormatters(schema) {
  const availableFormatters = Object.keys(schema).reduce((acc,v) => {
    const formatter = schema[v].formatter;
    if (formatter) {
      if (formatter in formatters) {
        acc[v] = formatters[formatter]();
      } else {
        console.error(`error: formatter ${formatter} is not valid`)
      }
    }
    return acc;
  }, {});
  return {
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
      return this.has(key, 'edit');
    },
    hasBlur(key) {
      return this.has(key, 'display');
    },
    hasFocus(key) {
      return this.has(key, 'edit');
    },
    hasDisplay(key) {
      return this.has(key, 'display');
    },
    hasEdit(key) {
      return this.has(key, 'edit');
    },
    hasResponse(key) {
      return this.has(key, 'response');
    },
    ...availableFormatters
  }
}
  
export function _formatFor(schema, answers, formatters, formatType, removeUnanswered = false) {
  const transformedAnswers = {};
  Object.keys(schema).forEach(key => {
    const answer = answers[key];
    
    if (!removeUnanswered || questionIsAnswered(answer, schema[key].type))
    if (schema[key].type === 'text') {
      if (formatters.has(key, formatType)) {
        transformedAnswers[key] = formatters[key][formatType](answer);
      } else {
        transformedAnswers[key] = answer;
      }
    } else if (schema[key].type === 'multi') {
      transformedAnswers[key] = answer ? [...answer] : [];
    } else if (schema[key].type === 'single') {
      transformedAnswers[key] = answer;
    }
  });
  return transformedAnswers;
}

export function formatAnswersForResponse(schema, answers, formatters) {
  return _formatFor(schema, answers, formatters, 'response', true);
}

export function formatAnswersForDisplay(schema, answers, formatters) {
  return _formatFor(schema, answers, formatters, 'display');
}
