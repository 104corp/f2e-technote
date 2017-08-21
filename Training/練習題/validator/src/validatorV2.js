const defaultOptions = {
    email:{
        maxLength: 250,
    },
    password:{
        acceptTypes: ['uppercase', 'lowercase', 'number', 'symbol'],
        avoidConfusedChars: false,
        atLeastOneUppercase: false,
        minLength: 8,
        maxLength: 30
    },
    id:{
        // default for mongodb objectId (type = string)
        length: 24,
        encoding: 'hex',
    }
};
const supportOptions = {
    email: {
        regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: {
        confusedCharsRegexp: /[0oO1lIi]/,
        oneUppercaseRegexp: /[A-Z]/,
        types: {
            uppercase: 'A-Z',
            lowercase: 'a-z',
            number: '0-9',
            symbol: '!%@#',
        },
    },
    id: {
        hexRegexp: /[a-fA-F\d]+\b/,
        base64Regexp: /[a-fA-F\d]+\b/,
    }
}

function Validator(){
    this.input;
    this.option;
    this.paramsTypes;  // [string, object] = 'so', ss', 'so', 'os', 'oo'....
}

/**
 * validate function for server-side use
 * @param {string, object} input  
 * @param {object}         option
 */
Validator.prototype.validate = function (input, option) {
    this.input = input;
    this.option = option || defaultOptions;

    if(!this.__checkParameters()){
        return { status: false, msg: 'input or option is empty' };
    };
    
    return this.__process();
}

/**
 * <private> check parameters are available, and return their types
 */
Validator.prototype.__checkParameters = function () {
    let inputType = (typeof this.input).substr(0, 1);    
    let optionType = (typeof this.option).substr(0, 1);  

    if( (inputType === 's' && !this.input) || 
        (inputType === 'o' && !Object.keys(this.input).length) ||
        (optionType === 'o' && !Object.keys(this.option).length)
    ){
        return false;
    }

    // detect params types 'ss', 'so', 'os', 'oo', ......
    this.paramsTypes = inputType + optionType;
    return true;
}

/**
 * <private> auto use correspond validator (contain custom and default)
 */
Validator.prototype.__process = function(){
    let name;
    switch(this.paramsTypes){
        
        case 'so':  // validate("test", {....})
            // more than 1 validator, only accept ONE!!!
            let ary = Object.getOwnPropertyNames(this.option);
            if(ary.length > 1){
                return { status: false, msg: 'more than one validator founded in option to validate input string' }
            }
            name = ary.shift();
            
            // not in supported list
            if(!supportOptions[name]){
                return { status: false, msg: 'this name of validator is not supported' }
            }
            // not find correspond method
            if(!(("__"+name) in this)){
                return { status: false, msg: 'cannot find correspond validate method' }
            }
            // call correspond private method
            return this['__'+name](this.input, this.option[name]);

        case 'ss':  // validate("test", "username")
            name = this.option;
            // not in supported list
            if(!supportOptions[name]){
                return { status: false, msg: 'this name of validator is not supported' }
            }
            // not find correspond method
            if(!(("__"+name) in this)){
                return { status: false, msg: 'cannot find correspond validate method' }
            }
            // call correspond private method
            return this['__'+name](this.input, {});

        //case 'ou':   // validate({ ... })
        case 'oo':  // validate({ ... }, { .... })
            let msgStack = [];
            for(let name in this.input){
                
                // not in supported list or not find correspond method
                if(!supportOptions.hasOwnProperty(name) || !(('__'+name) in this)){
                    // no customized validator in options, error
                    if(!this.option[name]){
                        msgStack.push({ status: false, msg: 'unsupported validator, and customized validator not found in option' });
                        continue;
                    }
                    // call customized validator
                    msgStack.push(this.__customize(this.input[name], this.option[name]));
                }else{
                    // customized setting can overwrite default setting
                    msgStack.push(this['__'+name](this.input[name], this.option[name]));
                }
            }
            return msgStack;

        default: 
            return { status: false, msg: 'error usage due to invalid input or option data type' }
    }
}

/**
 * <private> email address validator
 * @param {string} str        email address  
 * @param {object} customized customized setting in option
 */
Validator.prototype.__email = function (str, customized = {}) {
    let setting = JSON.parse(JSON.stringify(defaultOptions.email));

    for(let prop in customized){
        setting[prop] = customized[prop];
    }
    
    if(str.length > setting.maxLength){
        return { name: 'email', status: false, msg: 'email exceed maximum length'};
    }
    return (supportOptions.email.regexp.test(str)) ? { name: 'email', status: true } : { name: 'email', status: false, msg: 'invalid email format'};
}

/**
 * <private> password validator
 * @param {string} str        password  
 * @param {object} customized customized setting in option
 */
Validator.prototype.__password = function (str, customized = {}) {
    let regexp;
    let regexpStr;
    let setting = JSON.parse(JSON.stringify(defaultOptions.password));

    for(let prop in customized){
        setting[prop] = customized[prop];
    }
    
    // generate regexp from options, default is all allow
    regexpStr = setting.acceptTypes.map((type) => supportOptions.password.types[type] || '').join('');
    regexp = new RegExp(`[${regexpStr}]{${setting.minLength},${setting.maxLength}}`);

    if(str.length < setting.minLength){
        return { name: 'password', status: false, msg: `password too short, at least ${setting.minLength} characters` };
    }
    if(str.length > setting.maxLength){
        return { name: 'password', status: false, msg: 'password too long' };
    }
    if(!regexp.test(str)){
        return { name: 'password', status: false, msg: 'invalid password format' };
    }
    // if avoidConfusedChars is true
    if(setting.avoidConfusedChars && supportOptions.password.confusedCharsRegexp.test(str)){
        return { name: 'password', status: false, msg: 'contain confused characters in password' };
    }
    // if atLeastOneUppercase is true
    if(setting.atLeastOneUppercase && !supportOptions.password.oneUppercaseRegexp.test(str)){
        return { name: 'password', status: false, msg: 'at least contain one uppercase characters in password' };
    }

    return { name: 'password', status: true };
}

/**
 * <private> _id validator, default for mongodb's ObjectId
 * @param {string} str        _id, only accept STRING, ObjectId(xxxxx) is NOT ALLOWED
 * @param {object} customized customized setting in option
 */
Validator.prototype.__id = function (str, customized = {}) {
    let setting = JSON.parse(JSON.stringify(defaultOptions._id));

    for(let prop in customized){
        setting[prop] = customized[prop];
    }
    if(str.length !== setting.length){
        return { name: 'id', status: false, msg: `id does not equal ${setting.length} length` };
    }

    // individual process with encoding
    switch(setting.encoding){
        case 'hex':
            if((str.length % 2) !== 0){ 
                return { name: 'id', status: false, msg: `id has odd length is illegal in hex encoding` };
            }
            return (supportOptions._id.hexRegexp.test(str)) ? { name: 'id', status: true } : { name: 'id', status: false, msg: 'invalid id format with hex' };
            break;
        case 'base64':
            if((str.length % 4) !== 0){ 
                return { name: 'id', status: false, msg: `id's length need to be a multiple of 4 in base64 encoding` };
            }
            return (supportOptions._id.base64Regexp.test(str)) ? { name: 'id', status: true } : { name: 'id', status: false, msg: 'invalid id format with base64' };
            break;
    }
}

/**
 * <private> __customize validator, for any user defined validator
 * @param {string} str     input str
 * @param {object} setting customized validator setting
 */
Validator.prototype.__customize = function (str, setting) {
    // { name: xxx, regexp: xxx }
    return (setting.regexp.test(str)) ? { name: setting.name, status: true } : { name: setting.name, status: false, msg: `invalid ${setting.name} format` };
}

module.exports = Validator;