const mongooseAdmin = require('mongoose');

const adminSchema = new mongooseAdmin.Schema({
    uid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    security_info: {
        type: String,
        required: true
    }
});

module.exports = mongooseAdmin.model("Admin", adminSchema);