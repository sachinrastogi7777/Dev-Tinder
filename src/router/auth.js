const express = require('express');
const { validateSignupData } = require('../../utils/validation');
const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req.body);
        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                throw new Error("Email already in use.");
            }
        }
        if (req.body.mobileNumber) {
            const existingUser = await User.findOne({ mobileNumber: req.body.mobileNumber });
            if (existingUser) {
                throw new Error("Mobile number already in use.");
            }
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            skills: req.body.skills,
        });
        await user.save();
        res.send("User saved successfully...")
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
})

authRouter.get("/login", (async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!validator.isEmail(email)) {
            throw new Error("Please enter valid email.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Please enter correct password.");
        }
        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.send("Login successful.");
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
}));

module.exports = authRouter;