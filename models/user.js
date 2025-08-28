const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    mobileNumber: {
        type: Number
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;