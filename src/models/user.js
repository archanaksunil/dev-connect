const moongose = require("mongoose");

const userSchema = new moongose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20

    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 7,
        maxLength: 50
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        trim: true,
        min: 10
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) throw new Error("Gender not valid");
        }
    },
    skills: {
        type: [String]
    },
    photoUrl: {
        type: String,
        default: "https://avatar.iran.liara.run/public/boy?username=Ash"
    }
}, 
{
    timestamps: true
});

module.exports = moongose.model("User", userSchema);