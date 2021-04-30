/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 import { strict as assert } from 'assert';
 import sinon from "sinon";
 import { FieldFormatter, currencyFormatter, zipcodeFormatter } from '../../../src/routes/demographics/formatters.js';

 describe("formatters", function() {
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
            formatter = currencyFormatter();
        })
        it("sets the edit value to be a numeric string", function() {
            assert.equal(formatter.edit("$143,232"), "143232");
            assert.equal(formatter.edit("$143,232abcd"), "143232");
        })

        it("sets the display value to be a formatted US currency string", function() {
            // NOTE: Node 14.15.1 does not allow our use of Intl.NumberFormat.
            // We get RangeError: maximumFractionDigits value is out of range.
            // assert.equal(formatter.display("143232"), "$143,232");
        })
        it("sets the response value to be formatted as a number", function() {
            assert.equal(formatter.response("$142,353"), 142353);
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
        })
        it("sets the response value to be a numeric string", function() {
            assert.equal(formatter.response("90210"), "90210");
            assert.equal(formatter.response("90210abcd!!!!"), "90210");
        })
        it("properly validates a zipcode string", function() {
            assert.equal(formatter.isInvalid("90210"), false);
            assert.equal(formatter.isInvalid("90"), 'zipcode must be a five-digit number');
        })
    })
 })
