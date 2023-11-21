
const express = require("express");
const app = express();
const Quiz = require('./models/Quiz')
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const { studentConnection } = require("./config/database");
const { instructorConnection } = require("./config/database");
const { testConnection } = require("./config/database");
const { otpConnection } = require("./config/database");
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const { fileURLToPath } = require('url');
const fs = require('fs')
dotenv.config();
const PORT = process.env.PORT || 4000;
const multer  = require('multer')
const path = require('path');
const { spawn } = require('child_process');

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


const __dirnam = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirnam, 'uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });

app.post('/api/v1/upload', upload.array('files'), async (req, res) => {
  console.log("post yeh ho rha hai : ", req.body)
  try {
    const filePromises = req.files.map((file) => {
    /*  const content = fs.readFileSync(file.path);
      console.log(file.path)
      const newQuiz = Quiz.create({
        filename: file.originalname,
        path: file.path,
        size: file.size,
        content: content
      }); */
      let filePath = path.join(__dirname, 'uploads');
      filePath = path.join(filePath, file.originalname);
      console.log("DIRNAME", filePath)

      const pythonProcess = spawn('python', ['./indexx.py', filePath]);

      // Listen for data from the Python script (if needed)
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script output: ${data}`);
      });

      // Listen for errors (if any)
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error in Python script: ${data}`);
      });

      // Listen for the child process to close
      pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
      });
    });

    await Promise.all(filePromises);
    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
  });
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
});


//middlewares
app.use(bodyParser());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/*
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
*/
//cloudinary connection
//cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//def route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});



app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
