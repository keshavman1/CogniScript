const express = require("express");
const app = express();
const Quiz = require('./models/Quiz')
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const { MongoClient, ObjectId } = require('mongodb');
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
const Test = require('./models/Test')


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
  try {
    const filePromises = req.files.map((file) => {
      let filePath = path.join(__dirname, 'uploads');
      filePath = path.join(filePath, file.originalname);
      let courseTeacher = req.body.Teacher_id;
      console.log("TEACHER_id", courseTeacher)

      const pythonProcess = spawn('python', ['./indexx.py', filePath, courseTeacher]);

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

const uri = "mongodb+srv://prakarmisheena:5rIp5UykvaqtaR81@cluster0.otxbose.mongodb.net/";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB when the app starts
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB', err);
    return;
  }
  console.log('Connected to MongoDB');
});

app.get('/quizzes', async (req, res) => {
  try {
    const collection = client.db("quiz").collection("quizzes");
    const quizzes = await collection.find({}).toArray();
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send(error.message);
  }
});

app.get('/quizzes/:quizId', async (req, res) => {
  try {
    const collection = client.db("quiz").collection("quizzes");
    const quizId = req.params.quizId;

    const quiz = await collection.findOne({ uid: quizId });

    if (quiz) {
      res.json(quiz);
    } else {
    res.status(404).send('Quiz not found');
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send(error.message);
  }
});

app.post('/generateResults', async (req, res) => {
  try {
    const { coll, scores } = req.body;
    client.connect(err => {
      if (err) {
        console.error('Error connecting to MongoDB', err);
        return;
      }
      console.log('Connected to MongoDB');
    });
    const collection = client.db('students_test').collection(coll)

    const update = {
      $set: {
        SCORES : scores,
      },
    };
  
    // Update the document
    collection.updateOne({}, update, (err, result) => {
      if (err) {
        console.error('Error updating document:', err);
      } else {
        console.log('Document updated successfully');
      }
    });

    res.status(200).json("HO RHA HAI!");
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).send(error.message);
  }
});


// ... (Your existing code)

// ... (Previous code remains the same)

app.post('/submitAnswers', async (req, res) => {
  try {
    const { profile, answers } = req.body;
    const userId = profile.userId;
    const name = `${profile.firstName} ${profile.lastName}`;
    const SCORES = []
    console.log('Received profile:', profile);
    console.log('Received answers:', answers);

    // Use the user's name to dynamically create a collection
    const studentTestCollection = client.db("students_test").collection(name);

    // Create a new document with the user's answers
    const document = {
      userId,
      profile,
      answers,
      SCORES,
      // Add other fields as needed
    };

    // Insert the document into the collection
    const result = await studentTestCollection.insertOne(document);

    if (result.insertedCount === 1) {
      res.status(200).json({ success: true, message: 'Answers stored successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to store answers' });
    }
  } catch (error) {
    console.error('Error storing answers:', error);
    res.status(500).send(error.message);
  }
});


app.get('/getAnswers', async (req, res) => {
  try {
    client.connect(err => {
      if (err) {
        console.error('Error connecting to MongoDB', err);
        return;
      }
      console.log('Connected to MongoDB');
    });
  /*  const testId = req.test_id;

    if (!testId) {
      return res.status(400).json({ error: 'test_id is required in the query parameters' });
    }
    */
    const database = client.db("students_test");

    // Get the list of collections in the database
    const collections = await database.listCollections().toArray();

    const results = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);

      const quizzes = await collection.find({}).toArray();  

    /*  results.push({ collection: collectionName, quizzes });  */
      for (const quiz of quizzes) {
        if (quiz && quiz.answers) {
          results.push({ collection: collectionName, answers: quiz.answers });
        }
      }
    }

    // Respond with the matching quizzes across all collections
    res.json(results);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send(error.message);
  } 
});

// ... (Other existing routes and code)

// ... (



app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});