const validator = require("validator");

const validateUser = (req) => {
    const {firstName, lastName, email, password} = req;
    if(!firstName || !lastName) throw new Error("Invalid Name");
    else if(!validator.isEmail(email)) throw new Error("Invalid Email");
    else if(!validator.isStrongPassword(password)) throw new Error("Invalid Password");
}

module.exports = { validateUser };