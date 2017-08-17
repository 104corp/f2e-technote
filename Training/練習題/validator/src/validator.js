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
        confusedCharsRegexp: /0oO1lIi/,
    },
    string:{
        encoding: ['utf8', 'base64', 'base64Url', 'hex'],
    },
    id: {
        type: ['mongodb', 'uuid']
    }
}

function Validator(){
    this.name = "";
    this.msg = "";
}

/**
 * validate function for server-side use
 * @param {string, object} input  
 * @param {object}         option
 */
Validator.prototype.validate = function (input, option) {
    // check parameter available
    if(!Validator.__checkParameters(input, option)){
        return { status: false, msg: Validator.msg };
    };

    // auto get correspond name validator to process
    return Validator.__process(input, option);
}

/* ======== for private functions ======== */

Validator.prototype.__checkParameters = function (input, option) {
    if(!input|| !Object.keys(input).length){
        this.msg = 'input is empty';
        return false;
    }else if(!option || !option.name){
        this.msg = 'option name is empty';    
        return false;
    }
    this.name = option.name;
    return true;
}

Validator.prototype.__process = function(input, option, schema){
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

    return (name === 'custom') ? this['__'+name](option, schema) : this['__'+name](option);
}


Validator.prototype.__email = function (input, option) {
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

Validator.prototype.__password = function (input, option) {
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
        if(!regexp.test(input)){
            return { status: false, msg: 'invalid password format' };
        }
        // if avoidConfusedChars is true
        if(option.avoidConfusedChars && supportOptions.password.confusedCharsRegexp.test(input)){
            return { status: false, msg: 'contain confused characters in password' };
        }
        return { status: true };
    }
    if(input instanceof Array){
        return input.map((pass) => {
            if(!regexp.test(pass)){
                return { status: false, msg: 'invalid password format' };
            }
            // if avoidConfusedChars is true
            if(option.avoidConfusedChars && supportOptions.password.confusedCharsRegexp.test(pass)){
                return { status: false, msg: 'contain confused characters in password' };
            }
            return { status: true };
        });
    }
    return { status: false, msg: 'invalid data type of input'};
}

Validator.prototype.__string = function (input, option) {
    
}

Validator.prototype.__id = function (input, option) {
    
}