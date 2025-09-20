const express = require('express');
const userAuth = require('../middleware/auth');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("ERROR : " + error.message);
    }
})

module.exports = profileRouter;