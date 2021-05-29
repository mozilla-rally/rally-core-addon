/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 import { createResultObject } from '../../../src/routes/demographics/survey-tools.js';
 import { strict as assert } from 'assert';

 const schema = {
    income: {
        key: "income",
        type: "text",
        formatter: 'currency'
    },
    zipcode: {
        key: "zipcode",
        type: "text",
        formatter: "zipcode"
    },
    other: {
        key: "other",
        type: "single",
        values: [
            {"key": 'a', label: "A"},
            {"key": 'b', label: "B"},
        ]
    },
    otherMulti: {
        key: "otherMulti",
        type: "multi",
        values: [
            {key: "1", label: "One"},
            {key: "2", label: "Two"},
            {key: "3", label: "Three"},
        ]
    }
};

 describe('survey-tools', function() {
     describe('creatResultObject', function() {
        it("creates an empty resultObject based on a schema", function() {
            assert.deepEqual(createResultObject(schema), {
                income: '',
                zipcode: '',
                other: undefined,
                otherMulti: []
            })
        });
        it("creates a new resultObject based on a schema and additional answers", function() {
            assert.deepEqual(createResultObject(schema, {income: '10000', otherMulti: ["1", "3"]}), {
                income: '10000',
                zipcode: '',
                other: undefined,
                otherMulti: ["1", "3"]
            })
        })
     })
 })
