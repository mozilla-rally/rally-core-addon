<script>
 /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import  { getContext } from 'svelte';
import { writable } from 'svelte/store';
import { fly } from 'svelte/transition';
import createKey from '../key';

export let value;
export let validators = [];

const k = createKey();

const errors = getContext('rally::survey::choice::errors');

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

  const [validity, validator] = createFieldValidator(...validators);

  // set error state if this component gets dirty.
  $: if ($validity.dirty && !$validity.valid) {
      errors.update(state => {
        const next = {...state};
        next[k] = false;
        return next;
      });
    } else {
        errors.update(state => {
        const next = {...state};
        next[k] = true;
        return next;
      });
    }
</script>

<input
    use:validator={value}
    type="text"
    on:input
    {value} />
{#if $validity.dirty && !$validity.valid}
    <span
    class="mzp-c-fieldnote"
    transition:fly={{ duration: 300, y: 5 }}>
    {$validity.message}
    </span>
{/if}