var Prototype = require("../src/validatorV2");
var Validator = new Prototype();


console.log(Validator.validate("test@test.com", { name: "email", maxLength: 100}))