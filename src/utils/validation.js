const validator = require("validator");

const validateUser = (req) => {
    const {firstName, lastName, email, password} = req;
    if(!firstName || !lastName) throw new Error("Invalid Name");
    else if(!validator.isEmail(email)) throw new Error("Invalid Email");
    else if(!validator.isStrongPassword(password)) throw new Error("Invalid Password");
}

const validateEditUser = (req) => {
    const ALLOWED_FIELDS = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];
    const isAllowed = Object.keys(req.body).every((field) => ALLOWED_FIELDS.includes(field));
    return isAllowed;
}

module.exports = { validateUser, validateEditUser };