const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    mobileNumber: {
        type: Number,
        unique: true
    },
    skills: {
        type: Array,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;