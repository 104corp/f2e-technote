var assert = require("chai").assert;
var Prototype = require("../src/validatorV2");
var Validator = new Prototype();

describe('Public method validate()', () => {
    describe('# Email Validator', () => {
        it('default option', () => {
            basicDefaultOptionTests("email","test@test.com", "test<ts1...>@test.com");
        });
        it('custom option - length', () => {
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
            basicDefaultOptionTests("password","HelloWorld", "00--8800");
        });
        it('custom option - acceptTypes', () => {
            // valid
            assert.deepEqual(Validator.validate("ABCDEFGH", { password: { acceptTypes: ['uppercase'] }}), { name: 'password', status: true }, 'should be valid format with only accept uppercase');
            assert.deepEqual(Validator.validate("abcdefgh", { password: { acceptTypes: ['lowercase'] }}), { name: 'password', status: true }, 'should be valid format with only accept lowercase');
            assert.deepEqual(Validator.validate("88888888", { password: { acceptTypes: ['number'] }}), { name: 'password', status: true }, 'should be valid format with only accept numbers');
            assert.deepEqual(Validator.validate("!@!@%%##", { password: { acceptTypes: ['symbol'] }}), { name: 'password', status: true }, 'should be valid format with only accept symbol');
            
            // invalid
            assert.deepEqual(Validator.validate("ABCDEFG7", { password: { acceptTypes: ['uppercase'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept uppercase');
            assert.deepEqual(Validator.validate("abcdefg2", { password: { acceptTypes: ['lowercase'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept lowercase');
            assert.deepEqual(Validator.validate("8888888k", { password: { acceptTypes: ['number'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept number');
            assert.deepEqual(Validator.validate("!4!@-_##", { password: { acceptTypes: ['symbol'] }}), { name: 'password', status: false, msg: 'invalid password format' }, 'should be invalid format with only accept symbol');
        });
        it('custom option - length', () => {
            // valid
            assert.deepEqual(Validator.validate("00gg00iiffddpo", { password: { minLength: 12 }}), { name: 'password', status: true }, 'should be valid format with custom minLength');
            assert.deepEqual(Validator.validate("00ggff99ee", { password: { maxLength: 12 }}), { name: 'password', status: true }, 'should be valid format with custom maxLength');

            // invalid
            assert.deepEqual(Validator.validate("00gg00ii", { password: { minLength: 12 }}), { name: 'password', status: false, msg: 'password too short, at least 12 characters' }, 'should be invalid format with shorter than custom minLength');
            assert.deepEqual(Validator.validate("00ggff99ee00ii", { password: { maxLength: 12 }}), { name: 'password', status: false, msg: 'password too long' }, 'should be invalid format with exceed custom maxLength');
        });
        it('custom option - avoidConfusedChars', () => {
            // valid
            assert.deepEqual(Validator.validate("ffggff88", { password: { avoidConfusedChars: true }}), { name: 'password', status: true }, 'should be valid format with no confused characters');
            // invalid
            assert.deepEqual(Validator.validate("00gg00ii", { password: { avoidConfusedChars: true }}), { name: 'password', status: false, msg: 'contain confused characters in password' }, 'should be invalid format with contain confused characters');
        });
        it('custom option - atLeastOneUppercase', () => {
            // valid
            assert.deepEqual(Validator.validate("ffgGff88", { password: { atLeastOneUppercase: true }}), { name: 'password', status: true }, 'should be valid format with at least one Uppercase character');
            // invalid
            assert.deepEqual(Validator.validate("ffggff88", { password: { atLeastOneUppercase: true }}), { name: 'password', status: false, msg: 'at least contain one uppercase characters in password' }, 'should be invalid format with no Uppercase character');
        });
        it('custom option - mixed', () => {
            assert.deepEqual(Validator.validate("ffKgf88o", { password: { acceptTypes: ['uppercase', 'lowercase', 'number'], atLeastOneUppercase: true }}), { name: 'password', status: true }, 'should valid format with accept number, uppercase, lowercase, atleastOneUpper');
            assert.deepEqual(Validator.validate("ffgGll88", { password: { avoidConfusedChars: true, atLeastOneUppercase: true }}), { name: 'password', status: false, msg: 'contain confused characters in password' }, 'should be invalid format with contain avoid character (avoid confused, at least one upper true)');
            assert.deepEqual(Validator.validate("Ohanajan", { password: { avoidConfusedChars: true, atLeastOneUppercase: true, minLength: 12 }}), { name: 'password', status: false, msg: 'password too short, at least 12 characters' }, 'should be invalid format with no shorter than custom minLength');
        });
    });
    describe('# ID Validator', () => {
        it('default option', () => {
            basicDefaultOptionTests("id","98ffbbedb941944066dae5df", "98ffbbedb9419440ppppe5df");
        });
        it('custom option - hex', () => {
            // valid
            assert.deepEqual(Validator.validate("b18c15ce973f930ef1132d8cb25237f2a881e370", { id: { length: 40 }}), { name: 'id', status: true }, 'should be valid format with larger length');

            // invalid
            assert.deepEqual(Validator.validate("b18c15ce973f930ef1132d8cb252372a881e370", { id: { length: 39 }}), { name: 'id', status: false, msg: 'id has odd length is illegal in hex encoding' }, 'should be invalid format with odd length');
            assert.deepEqual(Validator.validate("b18c15ce973f930ef1132d8cb2zz37f2a881e370", { id: { length: 40 }}), { name: 'id', status: false, msg: 'invalid id format' }, 'should be invalid format with unsupported character');
        });
        it('custom option - base64', () => {
            // valid
            assert.deepEqual(Validator.validate("k9W7RFL3vKkj3232W24Ozb3QzJU=", { id: { length: 28, encoding: 'base64' }}), { name: 'id', status: true }, 'should be valid format with larger length');

            // invalid
            assert.deepEqual(Validator.validate("k9W7RFL3vKkj3232W24Ozb3QzJU=", { id: { length: 30, encoding: 'base64' }}), { name: 'id', status: false, msg: 'id does not equal 30 length' }, 'should be invalid format with length mismatch');
            assert.deepEqual(Validator.validate("k9W7RFL3vKkj3232W24Ozb3QzJ", { id: { length: 26, encoding: 'base64' }}), { name: 'id', status: false, msg: "id's length need to be a multiple of 4 in base64 encoding" }, 'should be invalid format with length not be a multiple of 4');
        });
    });
    describe('# Customized Validator', () => {
        it('custom option', () => {
            // valid
            assert.deepEqual(Validator.validate({ phone: "0912345678" }, { phone: { regexp: /09\d{8}/ }}), [{ name: 'phone', status: true }], 'should be valid format with custom phone validator');
            
            // invalid
            assert.deepEqual(Validator.validate({ phone: "0812345678" }, { phone: { regexp: /09\d{8}/ }}), [{ name: 'phone', status: false, msg: 'invalid phone format' }], 'should be valid format with custom phone validator');
        });
    });
    describe('# Multi Validator', () => {
        it('built-in validator', () => {
            let option = {};
            const input = {
                email: "test@test.com",
                id: "SrYc9Gt4sPBBIxbbNYluZk3SwH8=",
                password: "a!GkjArq497AA7br#"
            };
            let expectStack = [
                { name: "email", status: true },
                { name: "id", status: true },
                { name: "password", status: true },
            ]

            // valid
            option = {
                email: {
                    maxLength: 20
                },
                id: {
                    length: 28,
                    encoding: 'base64'
                },
                password: {
                    atLeastOneUppercase: true,
                    avoidConfusedChars: true
                }
            }
            assert.deepEqual(Validator.validate(input, option), expectStack, 'should be all valid with all custom options');
            assert.deepEqual(Validator.validate(input, { id: { length: 28, encoding: 'base64' }}), expectStack, 'should be all valid with custom & default options mixed');

            // invalid
            expectStack = [
                { name: "email", status: true },
                { name: "id", status: false, msg: 'id does not equal 24 length' },
                { name: "password", status: true },
            ]
            assert.deepEqual(Validator.validate(input), expectStack, 'should be partial invalid with built-in validator');
        });
        it('custom validator', () => {
            let option = {};
            const input = {
                phone: "0912345678",
                birth: "2017-08-21"
            };
            let expectStack = [
                { name: "phone", status: true },
                { name: "birth", status: true },
            ]

            // valid
            option = {
                phone: { regexp: /09\d{8}/ },
                birth: { regexp: /^\d{4}\-\d{2}\-\d{2}$/ }
            }
            assert.deepEqual(Validator.validate(input, option), expectStack, 'should be all valid with all custom validator');

            // invalid
            option = {
                phone: { regexp: /09\d{8}/ },
                birth: { regexp: /^\d{2}\-\d{2}\-\d{2}$/ }
            }
            expectStack = [
                { name: "phone", status: true },
                { name: "birth", status: false,  msg: 'invalid birth format' },
            ]
            assert.deepEqual(Validator.validate(input, option), expectStack, 'should be partial invalid with custom validator');
        });
        it('mixed validator', () => {
            const input = {
                id: "SrYc9Gt4sPBBIxbbNYluZk3SwH8=",
                password: "a!GkjArq497AA7br#",
                email: "test@test.com",
                phone: "0912345678",
                birth: "2017-08-21"
            };
            let options = {
                password: {
                    atLeastOneUppercase: true,
                    avoidConfusedChars: true
                },
                phone: { regexp: /09\d{8}/ },
                birth: { regexp: /^\d{2}\-\d{2}\-\d{2}$/ }
            }
            let expectStack = [
                { name: "id", status: false, msg: 'id does not equal 24 length' },
                { name: "password", status: true },
                { name: "email", status: true },
                { name: "phone", status: true },
                { name: "birth", status: false,  msg: 'invalid birth format' },
            ]

            // invalid
            assert.deepEqual(Validator.validate(input, options), expectStack, 'should be partial invalid with mixed validator');
        });
    });
});

/**
 * basic default option test with same valid / invalid input
 * @param {string} validatorName       validator's name (ex: email, password, id...)
 * @param {string} inputValidStr       input will be true
 * @param {string} inputInvalidStr     input will be false
 */
function basicDefaultOptionTests(validatorName, inputValidStr, inputInvalidStr){
    let objInput = {};
    let objOption = {};
    let expectObj = {};   
    let createExpectObj = (status, msg = undefined) => {
        return (msg) ? { name: validatorName, status, msg } : { name: validatorName, status };
    }

    objOption[validatorName] = {};

    // valid
    objInput[validatorName] = inputValidStr;
    expectObj = createExpectObj(true);

    assert.deepEqual(Validator.validate(inputValidStr, validatorName), expectObj, "should be valid format with string option");
    assert.deepEqual(Validator.validate(inputValidStr, objOption), expectObj, "should be valid format with object option");
    assert.deepEqual(Validator.validate(objInput), [expectObj], "should be valid format with object input and no option");
    assert.deepEqual(Validator.validate(objInput, objOption), [expectObj], "should be valid format with object input and option");


    // invalid
    objInput[validatorName] = inputInvalidStr;
    expectObj = createExpectObj(false, `invalid ${validatorName} format`);

    assert.deepEqual(Validator.validate(inputInvalidStr, validatorName), expectObj, "should be invalid format with string option");
    assert.deepEqual(Validator.validate(inputInvalidStr, objOption), expectObj, "should be invalid format with object option");
    assert.deepEqual(Validator.validate(objInput), [expectObj], "should be invalid format with object input and no option");
    assert.deepEqual(Validator.validate(objInput, objOption), [expectObj], "should be invalid format with object input and option");
    
    expectObj = { status: false, msg: 'error usage due to invalid input or option data type' };
    assert.deepEqual(Validator.validate(objInput, validatorName), expectObj, "should be invalid format with object input and string option");
}