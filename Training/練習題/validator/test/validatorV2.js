var assert = require("chai").assert;
var Prototype = require("../src/validatorV2");
var Validator = new Prototype();

describe('Public method validate()', () => {
    describe('# Email Validator', () => {
        it('default option', () => {});
        it('custom option', () => {});
    });
    describe('# Password Validator', () => {
        it('default option', () => {});
        it('custom option', () => {});
    });
    describe('# ID Validator', () => {
        it('default option', () => {});
        it('custom option', () => {});
    });
    describe('# Customized Validator', () => {
        it('custom option', () => {});
    });
});

describe('Private method __checkParameters()', () => {
    describe('# Invalid parameters', () => {
        it('empty input', () => {});
        it('empty option', () => {});
        it('unexpected input', () => {});
        it('unexpected option', () => {});
    });
    describe('# Detect params types', () => {
        it('more params', () => {});
        it('less params', () => {});
        it('correct params types', () => {});
    });
});

// FIXME: should test this loader, but return value is function result....
describe('Test private method __process()', () => {
    describe('# Allow paramsTypes', () => {
    });
    describe('# Deny paramsTypes', () => {
    });
});