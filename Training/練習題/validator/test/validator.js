var assert = require("chai").assert;
var Prototype = require("../src/validatorV2");
var Validator = new Prototype();


describe('Test public method validate()', () => {

    describe('# Different data type combination in use', () => {
        it('[input, option] = [string, string] should work', () => {});
        it('[input, option] = [string, object] should work', () => {});
        it('[input, option] = [object, string] should not work', () => {});
        it('[input, option] = [object, object] should work', () => {});
    });
    describe('# Built-in Validator', () => {
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

describe('test private method __checkParameters()', () => {
    describe('# Illegal parameters with option', () => {
        it('', () => {});
    });
    
});

describe('Test private method __process()', () => {
    
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

            assert.isFalse(Validator.__email("test@test.com", { maxLength: 0 }).status, "deny maxLength = zero");
            assert.isFalse(Validator.__email("test@test.com", { maxLength: undefined }).status, "deny maxLength = undefined");
            assert.isFalse(Validator.__email("test@test.com", { maxLength: null }).status, "deny maxLength = null");
        });
    });
    describe('# abnormal parameters', () => {
        it('valid str', () => {
            assert.isFalse(Validator.__email("123456").status, "invalid format with '123456'");
            assert.isFalse(Validator.__email("str").status, "invalid format with 'str'");
            assert.isFalse(Validator.__email("test@test").status, "invalid format with domain");
            assert.isFalse(Validator.__email("t/e\st!tt#jp@test.com").status, "should deny !#\/ in username");

            assert.isTrue(Validator.__email("test.tt+jp@test.com").status, "should accept +. in username");
            assert.isTrue(Validator.__email("test-tt_jp@test.com").status, "should accept -_ in username");
        });
        it('invalid str', () => {
            assert.isFalse(Validator.__email("").status, 'deny str = ""');
            assert.isFalse(Validator.__email(null).status, 'deny str = null');
            assert.isFalse(Validator.__email(undefined).status, 'deny str = undefined');
            assert.isFalse(Validator.__email(100).status, 'deny str = number');
            assert.isFalse(Validator.__email([]).status, 'deny str = []');
            assert.isFalse(Validator.__email({}).status, 'deny str = {}}');
            assert.isFalse(Validator.__email({}).status, 'deny str = {}}');
        });
        

        // for invalid customized
        it('allow customized = null / undefined', () => {});
        it('allow customized = null / undefined', () => {});
        it('deny str = []', () => {});
        it('allow str = {}', () => {});
        it('allow str = ""', () => {});
    });
});

describe('Test private method __password()', () => {
    
});

describe('Test private method __id()', () => {
    
});

describe('Test private method __customize()', () => {
    describe('# ', () => {
    });
    
});