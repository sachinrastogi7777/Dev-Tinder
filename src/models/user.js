const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = JWT.sign({ _id: user._id }, "DeVtInDeR@123", { expiresIn: '7d' });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;