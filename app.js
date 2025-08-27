const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
    try {
        const user = new User({
            firstName: "Sachin",
            lastName: "Rastogi",
            email: "sachin@gmail.com",
            password: "Sachin@12345",
            dateOfBirth: new Date("1997-10-23"),
            age: 27,
            gender: "Male",
            mobileNumber: 8709254547
        });
        await user.save();
        res.send("User saved successfully...")
    } catch (error) {
        console.log("Error saving usr:", error);
        res.status(500).send("Error saving user: " + error.message);
    }
})

app.get("/login", (req, res) => {
    res.send("Logged in...")
})

connectDb().then(() => {
    console.log("Database connected successfully...");
    app.listen(3000, () => {
        console.log("Server is running on port: 3000")
    })
}).catch(() => {
    console.log("Database connection failed!!!");
});