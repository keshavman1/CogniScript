const mongoose = require('mongoose');
const { quizConnection } = require('../config/database');

const quizSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    content: Buffer,  
    uploadDate: { type: Date, default: Date.now }
});

const Quiz = quizConnection.model("Quiz", quizSchema);
module.exports = Quiz;
