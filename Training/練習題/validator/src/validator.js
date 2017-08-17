const supportOptions = {
    email: {
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        accept: ['uppercase', 'lowercase', 'number', 'symbol'],
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
    // check input and option
    if(!input|| !Object.keys(input).length){
        return { status: false, msg: 'input is empty'};
    }
    if(!option.name){
        return { status: false, msg: 'option name is empty'};
    }

    // auto get correspond name validator to process
    return new Validator(option.name).process(input, option, schema);
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
    this.process = function (option, schema) {
        let name = this.name;
        // not in supported list
        if(!supportOptions(name)){
            return { status: false, msg: 'this name of validator is not supported'};
        }
        // not find correspond method
        if(!this.hasOwnProperty(name)){
            return { status: false, msg: 'cannot find correspond validate method'};
        }
        return (name === 'custom') ? this['_'+name](option, schema) : this['_'+name](option);
    };
}

Validator.prototype._email = function (input, option) {


}

Validator.prototype._password = function (input, option) {
    
}

Validator.prototype._string = function (input, option) {
    
}

Validator.prototype.id = function (input, option) {
    
}

Validator.prototype.custom = function (input, option, schema) {
    
}

Validator.prototype.validateForm = function () {
    
}