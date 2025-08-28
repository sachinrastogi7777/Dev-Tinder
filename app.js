const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send("User saved successfully...")
    } catch (error) {
        console.log("Error saving user:", error);
        res.status(500).send("Error saving user: " + error.message);
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({email: userEmail});
        if (user.length === 0) {
            res.status(404).send("User not found!!!");
        }
        else {
            res.send(user)
        }
    } catch (error) {
        console.log("Error finding user:", error);
        res.status(500).send("Error finding user: " + error.message);
    }
});

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
        console.log("Error finding user:", error);
        res.status(500).send("Error finding user: " + error.message);
    }
});

connectDb().then(() => {
    console.log("Database connected successfully...");
    app.listen(3000, () => {
        console.log("Server is running on port: 3000")
    })
}).catch(() => {
    console.log("Database connection failed!!!");
});