var assert = require("chai").assert;
var Prototype = require("../src/validatorV2");
var Validator = new Prototype();

describe('Public method validate()', () => {
    describe('# Email Validator', () => {
        it('default option', () => {
            // valid format
            assert.deepEqual(Validator.validate("test@test.com", "email"), { name: 'email', status: true }, "should be valid format with string option");
            assert.deepEqual(Validator.validate("test@test.com", { email: {} }), { name: 'email', status: true }, "should be valid format with object option");
            assert.deepEqual(Validator.validate({ email: "test@test.com" }), [{ name: 'email', status: true }], "should be valid format with object input and no option");
            assert.deepEqual(Validator.validate({ email: "test@test.com" }, { email:{} }), [{ name: 'email', status: true }], "should be valid format with object input and option");

            // invalid format
            assert.deepEqual(Validator.validate({ email: "test@test.com" }, "email"), { status: false, msg: 'error usage due to invalid input or option data type' }, "should be invalid format with object input and string option");

            assert.deepEqual(Validator.validate("test<ts1...>@test.com", "email"), { name: 'email', status: false, msg: 'invalid email format'}, "should be invalid format with string option");
            assert.deepEqual(Validator.validate("test<ts1...>@test.com", { email: {} }), { name: 'email', status: false, msg: 'invalid email format'}, "should be invalid format with object option");
            assert.deepEqual(Validator.validate({ email: "test<ts1...>@test.com" }), [{ name: 'email', status: false, msg: 'invalid email format'}], "should be invalid format with object input and no option");
            assert.deepEqual(Validator.validate({ email: "test<ts1...>@test.com" }, "email"), { status: false, msg: 'error usage due to invalid input or option data type' }, "should be invalid format with object input and string option");
            assert.deepEqual(Validator.validate({ email: "test<ts1...>@test.com" }, { email: {} }), [{ name: 'email', status: false, msg: 'invalid email format'}], "should be invalid format with object input and option");
        });
        it('custom option', () => {
            let longEmail = "";
            while(longEmail.length < 300){
                longEmail += "ttttttooth";
            }
            longEmail += "@gmail.com";

            // valid format
            assert.deepEqual(Validator.validate("test@test.com", { email: { maxLength: 20 } }), { name: 'email', status: true}, "should be valid format with shorter maxLength");

            // invalid format
            assert.deepEqual(Validator.validate(longEmail, "email"), { name: 'email', status: false, msg: 'email exceed maximum length'}, "should be invalid format with exceed default maxLength");
            assert.deepEqual(Validator.validate("test@test.com", { email: { maxLength: 10 }}), { name: 'email', status: false, msg: 'email exceed maximum length' }, "should be invalid format with exceed shorter maxLength");
        });
    });
    describe('# Password Validator', () => {
        it('default option', () => {
            // valid
            assert.deepEqual(Validator.validate("HelloWorld", "password"), { name: 'password', status: true }, 'should be valid format with string default option');
            assert.deepEqual(Validator.validate("HelloWorld", { password: {} }), { name: 'password', status: true }, 'should be valid format with object default option');
            assert.deepEqual(Validator.validate({ password: "HelloWorld" }), [{ name: 'password', status: true }], 'should be valid format with object input and no default option');
            assert.deepEqual(Validator.validate({ password: "HelloWorld" }, { password: {} }), [{ name: 'password', status: true }], 'should be valid format with object input and default option');

            // invalid
            assert.deepEqual(Validator.validate({ password: "HelloWorld" }, "password"), { status: false, msg: 'error usage due to invalid input or option data type' }, 'should be valid format with object input and string default option');

            assert.deepEqual(Validator.validate("00gg00", "password"), { name: 'password', status: false, msg: 'password too short, at least 8 characters' }, 'should be invalid format with string default option');
            assert.deepEqual(Validator.validate("00gg00", { password: {} }), { name: 'password', status: false, msg: 'password too short, at least 8 characters' }, 'should be invalid format with object default option');
            assert.deepEqual(Validator.validate({ password: "00gg00" }), [{ name: 'password', status: false, msg: 'password too short, at least 8 characters' }], 'should be invalid format with object input and no default option');
            assert.deepEqual(Validator.validate({ password: "00gg00" }, "password"), { status: false, msg: 'error usage due to invalid input or option data type' }, 'should be invalid format with object input and string default option');
            assert.deepEqual(Validator.validate({ password: "00gg00" }, { password: {} }), [{ name: 'password', status: false, msg: 'password too short, at least 8 characters' }], 'should be invalid format with object input and default option');
        });
        it('custom option', () => {
            // valid
            assert.deepEqual(Validator.validate("ABCDEFGH", { password: { acceptTypes: ['uppercase'] }}), { name: 'password', status: true }, 'should be valid format with only accept uppercase');
            assert.deepEqual(Validator.validate("abcdefgh", { password: { acceptTypes: ['lowercase'] }}), { name: 'password', status: true }, 'should be valid format with only accept lowercase');
            assert.deepEqual(Validator.validate("88888888", { password: { acceptTypes: ['number'] }}), { name: 'password', status: true }, 'should be valid format with only accept numbers');
            assert.deepEqual(Validator.validate("!@!@%%##", { password: { acceptTypes: ['symbol'] }}), { name: 'password', status: true }, 'should be valid format with only accept symbol');
            assert.deepEqual(Validator.validate("ffggff88", { password: { avoidConfusedChars: true }}), { name: 'password', status: true }, 'should be valid format with no confused characters');
            assert.deepEqual(Validator.validate("ffgGff88", { password: { atLeastOneUppercase: true }}), { name: 'password', status: true }, 'should be valid format with at least one Uppercase character');
            assert.deepEqual(Validator.validate("00gg00iiffddpo", { password: { minLength: 12 }}), { name: 'password', status: true }, 'should be valid format with custom minLength');
            assert.deepEqual(Validator.validate("00ggff99ee", { password: { maxLength: 12 }}), { name: 'password', status: true }, 'should be valid format with custom maxLength');

            // invalid
            assert.deepEqual(Validator.validate("ABCDEFG7", { password: { acceptTypes: ['uppercase'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept uppercase');
            assert.deepEqual(Validator.validate("abcdefg2", { password: { acceptTypes: ['lowercase'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept lowercase');
            assert.deepEqual(Validator.validate("8888888k", { password: { acceptTypes: ['number'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept number');
            assert.deepEqual(Validator.validate("!4!@-_##", { password: { acceptTypes: ['symbol'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept symbol');
            assert.deepEqual(Validator.validate("00gg00ii", { password: { avoidConfusedChars: true }}), { name: 'password', status: false, msg: 'contain confused characters in password' }, 'should be invalid format with contain confused characters');
            assert.deepEqual(Validator.validate("ffggff88", { password: { atLeastOneUppercase: true }}), { name: 'password', status: false, msg: 'at least contain one uppercase characters in password' }, 'should be invalid format with no Uppercase character');
            assert.deepEqual(Validator.validate("00gg00ii", { password: { minLength: 12 }}), { name: 'password', status: false, msg: 'password too short, at least 12 characters' }, 'should be invalid format with shorter than custom minLength');
            assert.deepEqual(Validator.validate("00ggff99ee00ii", { password: { maxLength: 12 }}), { name: 'password', status: false, msg: 'password too long' }, 'should be invalid format with exceed custom maxLength');
            

            // mixed
            assert.deepEqual(Validator.validate("ffKgf88o", { password: { acceptTypes: ['uppercase', 'lowercase', 'number'], atLeastOneUppercase: true }}), { name: 'password', status: true }, 'should valid format with accept number, uppercase, lowercase, atleastOneUpper');
            assert.deepEqual(Validator.validate("ffgGll88", { password: { avoidConfusedChars: true, atLeastOneUppercase: true }}), { name: 'password', status: false, msg: 'contain confused characters in password' }, 'should be invalid format with contain avoid character (avoid confused, at least one upper true)');
            assert.deepEqual(Validator.validate("Ohanajan", { password: { avoidConfusedChars: true, atLeastOneUppercase: true, minLength: 12 }}), { name: 'password', status: false, msg: 'password too short, at least 12 characters' }, 'should be invalid format with no shorter than custom minLength');
        });
    });
    describe('# ID Validator', () => {
        it('default option', () => {});
        it('custom option', () => {});
    });
    describe('# Customized Validator', () => {
        it('custom option', () => {});
    });
    describe('# Multi Validator', () => {
        it('no custom option', () => {});
        it('with custom option', () => {});
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