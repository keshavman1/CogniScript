const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const validator = require('validator');
const { spawn } = require('child_process');
const jwt = require("jsonwebtoken");
//sendOTP

exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await Student.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};


//signup-student-instructor-admin

exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			uid,
			email,
			password,
			confirmPassword,
			security_info,
			otp,
			accountType,
		} = req.body;

		// Create an array to collect error messages
		const errors = [];

		// Check if All Details are there or not
		if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
			errors.push("All Fields are required");
		}

		// Check if password and confirm password match
		if (password !== confirmPassword) {
			errors.push("Password and Confirm Password do not match. Please try again.");
		}

		if (errors.length > 0) {
			return res.status(400).json({
				success: false,
				errors: errors,
			});
		}

        if (accountType === "Student") {
			const existingUser = await Student.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Student already exists. Please sign in to continue.",
				});
			}

			// Find the most recent OTP for the email
			const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

			if (response.length === 0 || otp !== response[0].otp) {
				return res.status(400).json({
					success: false,
					message: "The OTP is not valid",
				});
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create the user
			const student = await Student.create({
				firstName,
				lastName,
				uid: 1,
				email,
				password: hashedPassword,
				security_info: null,
				image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
			});
			const Stname = firstName + ' ' + lastName;
			const pythonProcess = spawn('python', ['./controllers/studenttry.py', Stname]);

			pythonProcess.stdout.on('data', (data) => {
				console.log(`Python script output: ${data}`);
			});

			pythonProcess.stderr.on('data', (data) => {
				console.error(`Error in Python script: ${data}`);
			});

			pythonProcess.on('close', (code) => {
				console.log(`Python script exited with code ${code}`);
				res.status(200).json({ success: true, message: 'Data saved and Python script executed successfully' });
			}); 

        } else if (accountType === "Instructor") {
			const existingUser = await Instructor.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Instructor already exists. Please sign in to continue.",
				});
			}

			// Find the most recent OTP for the email
			const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

			if (response.length === 0 || otp !== response[0].otp) {
				return res.status(400).json({
					success: false,
					message: "The OTP is not valid",
				});
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create the user
			const instructor = await Instructor.create({
				firstName,
				lastName,
				email,
				password: hashedPassword,
				security_info: null,
				role: null,
			});
			return res.status(200).json({
				success: true,
				instructor,
				message: "Instructor registered successfully",
			});

        } 
		else if (accountType == "Admin"){
			return res.status(200).json({
				success: true,
				admin,
				message: "Admin registered successfully",
		});
		} else {
            // Handle an invalid accountType here if needed
            return res.status(400).json({
                success: false,
                message: "Invalid account type.",
            });
        }
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};



//login

exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password, accountType } = req.body;
		console.log(req.body);
		// Check if email or password is missing
		if (!email || !password || !accountType) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		
		
		//const admin = await Admin.findOne({ email });

		if (accountType === "Student")
		{
			const student = await Student.findOne({ email });
			if (await bcrypt.compare(password, student.password)) {
				const token = jwt.sign(
					{ email: student.mail, id: student._id},
					process.env.JWT_SECRET,
					{
						expiresIn: "24h",
					}
				);
	
				// Save token to user document in database
				student.token = token;
				student.password = undefined;
				// Set cookie for token and return success response
				const options = {
					expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
					httpOnly: true,
				};
				res.cookie("token", token, options).status(200).json({
					success: true,
					token,
					student,
					message: `User Login Success`,
				});
			} else {
				return res.status(401).json({
					success: false,
					message: `Password is incorrect`,
				});
			}
		}
		else if (accountType === "Instructor")
		{
			const instructor = await Instructor.findOne({ email });
			if (await bcrypt.compare(password, instructor.password)) {
				const token = jwt.sign(
					{ email: instructor.mail, id: instructor._id},
					process.env.JWT_SECRET,
					{
						expiresIn: "24h",
					}
				);
	
				// Save token to user document in database
				instructor.token = token;
				instructor.password = undefined;
				// Set cookie for token and return success response
				const options = {
					expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
					httpOnly: true,
				};
				res.cookie("token", token, options).status(200).json({
					success: true,
					token,
					instructor,
					message: `User Login Success`,
				});
			} else {
				return res.status(401).json({
					success: false,
					message: `Password is incorrect`,
				});
			}
		}
		else
		{
			return res.status(401).json({
				success: false,
				message: `Not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};

//changePassword

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await Student.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};