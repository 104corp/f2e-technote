var assert = require("chai").assert;
var Prototype = require("../src/validatorV2");
var Validator = new Prototype();

//TODO:
describe('Test public method validate()', () => {
    describe('# Built-in Validator', () => {
        describe('## with default option', () => {
            it('validate(string, string) should work', () => {
                assert.deepEqual(
                    Validator.validate("test@test.com", "email"),
                    { name: 'email', status: true },
                    "should be valid email format"
                );
                assert.deepEqual(
                    Validator.validate("daoi870Fxfbs", "password"),
                    { name: 'password', status: true },
                    "should be valid password format"
                );
                assert.deepEqual(
                    Validator.validate("3130306168676f6173646967", "_id"),
                    { name: '_id', status: true },
                    "should be valid _id format with 24 bytes hex"
                );
            });
            it('validate(string, object) should work', () => {
                assert.deepEqual(
                    Validator.validate("test@test.com", { name: "email" }),
                    { name: 'email', status: true },
                    "should be valid email format"
                );
                assert.deepEqual(
                    Validator.validate("daoi870Fxfbs", { name: "password" }),
                    { name: 'password', status: true },
                    "should be valid password format"
                );
                assert.deepEqual(
                    Validator.validate("3130306168676f6173646967", { name: "_id" }),
                    { name: '_id', status: true },
                    "should be valid _id format with 24 bytes hex"
                );
            });
            it('validate(object, object) should work', () => {
                let data = {
                    email: "test@test.com",
                    password: "daoi870Fxfbs",
                    _id: "3130306168676f6173646967"
                };
                let resultStack = [];
                for(let name in data){
                    resultStack.push({ name: name, status: true })
                }
                assert.deepEqual(Validator.validate(data, {}), resultStack, "should be valid with default options");
            });
            
            it('validate(object, string) should not work', () => {
                assert.deepEqual(
                    Validator.validate({ email: "test@test.com" }, "email"),
                    { status: false, msg: 'error usage due to invalid input or option data type' },
                    "should be invalid with default options"
                );
            });
        });

        describe('## with custom option', () => {

        });
    });
    
    describe('# Customized Validator', () => {
    });
    describe('# Illegal parameters with input', () => {
        it('', () => {});
    });
    describe('# Illegal parameters with option', () => {
        it('', () => {});
    });
});

//TODO:
describe('test private method __checkParameters()', () => {
    describe('# Illegal parameters with option', () => {
        it('', () => {});
    });
    
});

//TODO:
describe('Test private method __process()', () => {
    describe('# supported validator', () => {
        it('can find correspond private method', () => {
            assert.isTrue(Validator.__process("test@test.com", "email").status, "success with 'email'");
            assert.isTrue(Validator.__process("sdgas25ASBzx", "password").status, "success with 'password'");
            assert.isFalse(Validator.__process("sjakdgjaskd", "_id").status, "success with '_id'");

            assert.isTrue(Validator.__process("test@test.com", { name: "email" }).status, "success with object option");
            assert.isTrue(Validator.__process("sdgas25ASBzx", { name: "password" }).status, "success with object password");
            assert.isFalse(Validator.__process("sjakdgjaskd", { name: "_id" }).status, "success with object _id");
        });
        it('cannot find correspond private method', () => {
            assert.isFalse(Validator.__process("sjakdgjaskd", "tooooo").status, "failed with unknown private method by string");
            assert.isFalse(Validator.__process("sjakdgjaskd", { name: "goo" }).status, "failed with unknown private method by object");
        });
    });
    describe('# unsupported validator', () => {
        it('with custom validator option', () => {
            assert.isTrue(Validator.__email("test@test.com").status, "valid format with customized = undefined");
        });
        it('with no custom validator option', () => {
            
        });
    });
    describe('# abnormal parameters', () => {

    });
});

describe('Test private method __email()', () => {
    describe('# default setting', () => {
        it('should accept empty customized', () => {
            assert.isTrue(Validator.__email("test@test.com").status, "valid format with customized = undefined");
            assert.isTrue(Validator.__email("test@test.com", {}).status, "valid format with customized = {}");
        });
        it('should accept customized', () => {
            assert.isTrue(Validator.__email("test@test.com", { maxLength: 20 }).status, "short than maxLength valid");
        });
    });
    describe('# custom setting', () => {
        it('valid maxLength', () => {
            assert.isTrue(Validator.__email("test@test.com", { maxLength: 20 }).status, "valid format with shorter maxLength");
            assert.isFalse(Validator.__email("test@test.com", { maxLength: 10 }).status, "invalid format with shorter maxLength");

            let longEmail = "";
            for(let i = 0; i < 30; i++){  longEmail += "toooooooth";  }
            longEmail += "@gmail.com";

            assert.isFalse(Validator.__email(longEmail, { maxLength: 300 }).status, "invalid format with longer maxLength");
            assert.isTrue(Validator.__email(longEmail, { maxLength: 400 }).status, "valid format with longer maxLength");
        });

        it('abnormal maxLength', () => {
            assert.isTrue(Validator.__email("test@test.com", { maxLength: '30' }).status, "allow maxLength = string number");
            assert.isFalse(Validator.__email("test@test.com", { maxLength: undefined }).status, "deny maxLength = undefined");
        });
    });
    describe('# abnormal parameters', () => {
        it('username format', () => {
            assert.isTrue(Validator.__email("te-s_t.tt+jp@test.com").status, "should accept +.-_ in username");
            assert.isFalse(Validator.__email("t/e\st!tt#jp@test.com").status, "should deny !#\/ in username");
        });
        it('domain format', () => {
            assert.isFalse(Validator.__email("test@test").status, "should deny incomplete domain");
        });

        it('abnormal str', () => {
            assert.isFalse(Validator.__email("123456").status, "invalid format with '123456'");
            assert.isFalse(Validator.__email("str").status, "invalid format with 'str'");
            
            assert.isFalse(Validator.__email(undefined).status, 'deny str = undefined');
            assert.isFalse(Validator.__email(100).status, 'deny str = number');
            assert.isFalse(Validator.__email([]).status, 'deny str = []');
            assert.isFalse(Validator.__email({}).status, 'deny str = {}}');
        });
        
        it('abnormal customized', () => {
            assert.isTrue(Validator.__email("test@test.com", null).status, "allow customized = null");
            assert.isTrue(Validator.__email("test@test.com", {}).status, "deny customized = {}");
            
            assert.isFalse(Validator.__email("test@test.com", []).status, "deny customized = []");
            assert.isFalse(Validator.__email("test@test.com", '').status, "deny customized = ''");
        });
    });
});

//TODO:
describe('Test private method __password()', () => {
    describe('# default setting', () => {});
    describe('# custom setting', () => {});
    describe('# abnormal parameters', () => {});
});

//TODO:
describe('Test private method __id()', () => {
    describe('# default setting', () => {});
    describe('# custom setting', () => {});
    describe('# abnormal parameters', () => {});
});

//TODO:
describe('Test private method __customize()', () => {
    describe('# abnormal parameters', () => {});
});