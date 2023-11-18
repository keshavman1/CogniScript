const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    test_id: {
        type: Number,
        require: true,
    },
    test_date: {
        type: Date,
        default: Date.now(),
    },
    instructor_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "instructor",
        }
    ],
    questions: {
        type: [String],
        required: true,
    },
    answers: {
        type: [String],
        required: true,
    },
    Students_present: [String]
});

module.exports = mongoose.model("Test", testSchema);