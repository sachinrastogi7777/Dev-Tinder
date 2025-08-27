const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(
        'mongodb+srv://devTinder:3EkMITrFS8G44s9M@devtinder.oazeshs.mongodb.net/devTinder'
    );
};

module.exports = connectDb;