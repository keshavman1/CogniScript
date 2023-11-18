const mongoose = require("mongoose");
const { studentConnection } = require("../config/database");

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    uid: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    security_info: {
        type: String,
    },
    image: {
      type: String,
    }
});

const Student = studentConnection.model("Student", studentSchema);

module.exports = Student;


/*
const mongoose = require("mongoose");
const { connectStudentDatabase } = require("../config/database");

connectStudentDatabase();

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  uid: {
    type: String,
    required: true,
    trim: true,
  },
  mail: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  security_info: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema, "students");

module.exports = Student;

*/