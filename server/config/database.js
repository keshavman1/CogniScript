const mongoose = require("mongoose");
require("dotenv").config();

const studentConnection = mongoose.createConnection("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/students");
const instructorConnection = mongoose.createConnection("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/instructors");
const testConnection = mongoose.createConnection("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/tests");
const otpConnection = mongoose.createConnection("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/otp")
const quizConnection = mongoose.createConnection("mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/quiz")
module.exports = {
  studentConnection,
  instructorConnection,
  testConnection,
  otpConnection,
  quizConnection,
};


/*
const mongoose = require("mongoose");

const connectStudentDatabase = () => {
  mongoose.connect("mongodb://localhost/students");
};

const connectInstructorDatabase = () => {
  mongoose.connect("mongodb://localhost/instructors");
};

const connectTestDatabase = () => {
  mongoose.connect("mongodb://localhost/tests");
};

module.exports = {
  connectStudentDatabase,
  connectInstructorDatabase,
  connectTestDatabase,
};

*/