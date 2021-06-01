/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 import { strict as assert } from 'assert';
 // eslint-disable-next-line  node/no-extraneous-import
 import sinon from "sinon";
 import { FieldFormatter, currencyFormatter, zipcodeFormatter, _formatFor, createInputFormatters } from '../../../src/routes/demographics/formatters.js';

 describe("formatters", function() {
    let format;
    beforeEach(function() {
        format = sinon.fake.returns("$20,000");
        global.Intl.NumberFormat = function() {
            return {format(v) { return format(v) }};
        }
    })
    describe("The FieldFormatter class", function() {
         let formatter;
         beforeEach(function() {
             formatter = new FieldFormatter();
         })
        it("sets alignRight if set in constructor", function() {
            assert.equal(formatter.alignRight, false);
            const formatterWithAlignRight = new FieldFormatter({ alignRight: true });
            assert.equal(formatterWithAlignRight.alignRight, true);
        })
        it('sets the callbacks as expected', function() {
            const isInvalid = sinon.fake();
            const edit = sinon.fake();
            const display = sinon.fake();
            const response = sinon.fake();
            formatter.setValidator(isInvalid);
            formatter.formatForEditing(edit);
            formatter.formatForDisplay(display);
            formatter.formatForResponse(response);
            // these are the functions that need to be called.
            formatter.isInvalid("test");
            formatter.edit("test");
            formatter.display("test");
            formatter.response("test");
            assert.ok(isInvalid.called);
            assert.ok(edit.called);
            assert.ok(display.called);
            assert.ok(response.called);
        })
     })
    describe("currencyFormatter", function() {
        let formatter;
        beforeEach(function() {
            // NOTE: we will test against a two-digit `maximumFractionDigits` because
            // otherwise Node complains.
            formatter = currencyFormatter(2);
        })
        it("sets the edit value to be a numeric string", function() {
            assert.equal(formatter.edit("$143,232"), "143232");
            assert.equal(formatter.edit("$143,232abcd"), "143232");
        })

        it("sets the display value to be a formatted US currency string", function() {
            // NOTE: Node 14.15.1 does not allow our use of Intl.NumberFormat without compiling.
            // So we are taking over global.Intl.NumberFormat for now which should return either
            // a call to sinon.fake or return an empty string.
            assert.equal(formatter.display("20000"), "$20,000");
            // check that sinon.fake was called.
            assert.equal(format.callCount, 1);
            assert.equal(formatter.display(""), "");
            assert.equal(format.callCount, 1);
        })

        it("sets the response value to be formatted as a number", function() {
            assert.equal(formatter.response("$142,353"), 142353);
            assert.equal(formatter.response(""), undefined);
        })
    })
    describe('zipcodeFormatter', function() {
        let formatter;
        beforeEach(function() {
            formatter = zipcodeFormatter();
        })
        it("sets the edit value to be a numeric string", function() {
            assert.equal(formatter.edit("90210"), "90210");
            assert.equal(formatter.edit("90210abcd"), "90210");
        })

        it("sets the display value to be a numeric string", function() {
            // NOTE: Node 14.15.1 does not allow our use of Intl.NumberFormat.
            // We get RangeError: maximumFractionDigits value is out of range.
            assert.equal(formatter.display("90210"), "90210");
            assert.equal(formatter.display("90210abcd"), "90210");
            assert.equal(formatter.display(undefined), "");
        })
        it("sets the response value to be a numeric string", function() {
            assert.equal(formatter.response("90210"), "90210");
            assert.equal(formatter.response("90210abcd!!!!"), "90210");
            assert.equal(formatter.response(undefined), "");
        })
        it("properly validates a zipcode string", function() {
            assert.equal(formatter.isInvalid("90210"), false);
            assert.equal(formatter.isInvalid("90"), 'zipcode must be a five-digit number');
            assert.equal(formatter.isInvalid(undefined), false);
        })
    })
    describe("_formatFor", function() {
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
                type: "single",
                values: [
                    {"key": 'a', label: "A"},
                    {"key": 'b', label: "B"},
                ]
            },
            otherMulti: {
                type: "multi",
                values: [
                    {key: "1", label: "One"},
                    {key: "2", label: "Two"},
                    {key: "3", label: "Three"},
                ]
            }
        };
        let formatters;
        beforeEach(function() {
            formatters = createInputFormatters(schema);
        });
        it("formats a typical payload for display", function() {
            const answers1 = { income: "20000", zipcode: "90210", other: "a", otherMulti: ["1", "3"]};
            const formattedAnswers1 = _formatFor(schema, answers1, formatters, "display");
            assert.deepEqual(formattedAnswers1, {
                income: "$20,000",
                zipcode: "90210",
                other: "a",
                otherMulti: ["1", "3"]
            });
            const answers2 = { income: "", zipcode: "", other: "a", otherMulti: ["1", "3"]};
            const formattedAnswers2 = _formatFor(schema, answers2, formatters, "display");
            assert.deepEqual(formattedAnswers2, {
                income: "",
                zipcode: "",
                other: "a",
                otherMulti: ["1", "3"]
            });
        });
        it("formats a typical payload for response", function() {
            const answers = { income: "$20,000", zipcode: "90210", other: "a", otherMulti: ["1", "3"]};
            const formattedAnswers = _formatFor(schema, answers, formatters, "response");
            assert.deepEqual(formattedAnswers, {
                income: 20000,
                zipcode: "90210",
                other: "a",
                otherMulti: ["1", "3"]
            })
        });

        it("formats a typical payload for response, removing unanswered questions", function() {
            const answers = { income: undefined, zipcode: "90210", other: undefined, otherMulti: []};
            const formattedAnswers = _formatFor(schema, answers, formatters, "response", true);
            assert.deepEqual(formattedAnswers, {
                zipcode: "90210",
            })
        });
    })
 })
