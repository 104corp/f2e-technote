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
    // for input
    if(!input){
        this.msg = 'input string is empty';
        return false;
    }
    if(typeof input === 'object' && !Object.keys(input).length){
        this.msg = 'input object is empty';
        return false;
    }

    // for option
    if(!option){
        this.msg = 'option string is empty';
        return false;
    }
    if(typeof option === 'object' && !Object.keys(option).length){
        this.msg = 'option object is empty';
        return false;
    }
    return true;
}

// 
Validator.prototype.__process = function(input, option){
    // Validator.validate("test", "username")
    if(typeof input === 'string' && typeof option === 'string'){
        let name = option;
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

    // Validator.validate({ ... }, { .... }), input prop name need equal to option prop name



}

Validator.prototype.__email = function (input, option) {}

Validator.prototype.__password = function (input, option) {}

Validator.prototype.__string = function (input, option) {}

Validator.prototype.__id = function (input, option) {}