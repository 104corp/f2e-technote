const supportOptions = {
    email: {
        regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        acceptDefault: ['uppercase', 'lowercase', 'number', 'symbol'],
        accept: {
            uppercase: 'A-Z',
            lowercase: 'a-z',
            number: '0-9',
            symbol: '!%@#',
        },
        confusedCharacters: [
            new Set(['0', 'o', 'O']),
            new Set(['1', 'l', 'I', 'i']),
            new Set(['$', 'S', 's']),
        ]
    },
    string:{
        encoding: ['utf8', 'base64', 'base64Url', 'hex'],
    },
    id:{
        types: ['mongodb', 'uuid'],
    },
    custom: {}
}

/**
 * validate function for server-side use
 * @param {string, object, array} input  
 * @param {object}                option
 * @param {object}                schema - optional
 */
function validate(input, option, schema = null){
    let Validator = new Validator(option.name);

    // check parameter available
    if(!Validator.checkParameters(input, option, schema)){
        return { status: false, msg: Validator.msg };
    };

    // auto get correspond name validator to process
    return Validator.process(input, option, schema);
}

/**
 * use selector validate html form for client-side use
 * @param {string} selector
 * @param {object} formOptions
 */
function validateForm(selector, formOptions){
    
}

module.exports = {
    validate,
    valideteForm,
}








function Validator(name){
    this.name = name;
    this.msg = "";
}

Validator.prototype.checkParameters = function (input, option, schema) {
    if(!input|| !Object.keys(input).length){
        this.msg = 'input is empty';
        return false;
    }else if(!option || !option.name){
        this.msg = 'option name is empty';
        return false;
    }else if(option.name === 'custom' && !Object.keys(schema).length){
        this.msg = 'when customize validator,  schema is required';
        return false;
    }
    return true;
}

Validator.prototype.process = function(input, option, schema){
    let name = this.name;

    // not in supported list
    if(!supportOptions[name]){
        this.msg = 'this name of validator is not supported';
        return { status: false, msg: this.msg }

    // not find correspond method
    }else if(!this.hasOwnProperty(name)){
        this.msg = 'cannot find correspond validate method';
        return { status: false, msg: this.msg }
    }

    return (name === 'custom') ? this['_'+name](option, schema) : this['_'+name](option);
}


Validator.prototype._email = function (input, option) {
    let regexp = supportOptions.email.regexp;

    // string -> reg test, array -> map reg test
    // NOT ALLOW object
    if(typeof input === 'string'){
        return (regexp.test(input)) ? { status: true } : { status: false, msg: 'invalid email format'};
    }
    if(input instanceof Array){
        return input.map((email) => (regexp.test(email)) ? { status: true } : { status: false, msg: 'invalid email format'});
    }
    return { status: false, msg: 'invalid data type of input'};
}

Validator.prototype._password = function (input, option) {
    let regexp;
    let regexpStr;

    // generate regexp from options, default is all allow
    if(!option.accept){
        option.accept = supportOptions.password.acceptDefault;
    }
    regexpStr = option.accept.map((type) => accept.type || '').join('');
    regexp = new RegExp(regexpStr);

    // string -> reg test, array -> map reg test
    // NOT ALLOW object
    if(typeof input === 'string'){
        return (regexp.test(input)) ? { status: true } : { status: false, msg: 'invalid password format'};
    }
    if(input instanceof Array){
        return input.map((pass) => (regexp.test(pass)) ? { status: true } : { status: false, msg: 'invalid password format'});
    }
    return { status: false, msg: 'invalid data type of input'};
}

Validator.prototype._string = function (input, option) {
    
}

Validator.prototype._id = function (input, option) {
    
}








Validator.prototype._custom = function (input, option, schema) {
    
}

Validator.prototype._validateForm = function () {
    
}