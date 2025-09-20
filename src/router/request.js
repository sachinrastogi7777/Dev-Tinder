const express = require('express');
const userAuth = require('../middleware/auth');

const requestRouter = express.Router();

requestRouter.post("/connectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send("Connection request sent by " + user.firstName + " " + user.lastName);
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
})

module.exports = requestRouter;