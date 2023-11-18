const mongoose = require('mongoose');
const { instructorConnection } = require("../config/database");

const instructorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    security_info: {
        type: String,
    },
    role: {
        type: String,
    },
});

const Instructor = instructorConnection.model("Instructor", instructorSchema);

module.exports = Instructor;