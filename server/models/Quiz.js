const mongoose = require('mongoose');
const { quizConnection } = require('../config/database');

const quizSchema = new mongoose.Schema({
    name: String,
    file: {
        data: Buffer,       // Buffer of the file
        contentType: String,
        filename: String,
    },
});

const Quiz = quizConnection.model("Quiz", quizSchema);
module.exports = Quiz;
