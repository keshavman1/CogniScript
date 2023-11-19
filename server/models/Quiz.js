const mongoose = require('mongoose');

const Quiz = new mongoose.Schema({
    name : String
});

module.exports = mongoose.model("Quiz", Quiz);