const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { ageValidation, passwordValidation, validateSignupData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// User Signup API.
app.post("/signup", async (req, res) => {
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

app.get("/login", (async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Please enter correct password.");
        }
        res.send("Login successful.");
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
}));

// Get user by email.
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({ email: userEmail });
        if (user.length === 0) {
            res.status(404).send("User not found!!!");
        }
        else {
            res.send(user)
        }
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
});

// Get all the users.
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            res.status(404).send("Users not found!!!");
        }
        else {
            res.send(users);
        }
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
});

// Delete user by Id.
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully...");
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
});

// Update user.
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const body = req.body;
    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "password", "dateOfBirth", "gender", "mobileNumber", "skills"];
        const isValidUpdate = Object.keys(body).every((update) => ALLOWED_UPDATES.includes(update));
        if (!isValidUpdate) {
            throw new Error("Invalid fields updates!!!");
        };
        if (body.dateOfBirth) {
            const age = ageValidation(body.dateOfBirth);
            if (age < 13) {
                throw new Error("User must be at least 13 years old.");
            }
        };
        if (body.skills?.length > 10) {
            throw new Error("Skills can't be more than 10");
        };
        await User.findOneAndUpdate({ _id: userId }, body, { runValidators: true });
        res.send("User updated successfully...")
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
})

connectDb().then(() => {
    console.log("Database connected successfully...");
    app.listen(3000, () => {
        console.log("Server is running on port: 3000")
    })
}).catch(() => {
    console.log("Database connection failed!!!");
});