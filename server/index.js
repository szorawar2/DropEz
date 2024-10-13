// server/index.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import multer from "multer";
import path from "path";
import busboy from "busboy";

import pool from "./db.js";

const uploadPath = "../uploads/";

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_jwt_secret_key"; // Keep this secure and hidden in env variables

// Middleware
app.use(cors()); // Allow React to communicate with Node
app.use(bodyParser.json()); // Parse incoming JSON requests
// Middleware to parse URL-encoded data (text fields in form)
app.use(express.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Define the directory where files will be saved
//     cb(null, uploadPath); // Make sure this directory exists
//   },
//   filename: (req, file, cb) => {
//     //cb(null, file.originalname); // Use the original file name
//     console.log(req.body);
//     console.log(file);
//     const userId = req.body.user_id; // Get user_id from request
//     const messageIndex = req.body.message_index; // Get message index from request
//     const fileExt = path.extname(file.originalname); // Get file extension
//     const newFileName = `${userId}_${messageIndex}${fileExt}`; // Create new file name
//     cb(null, newFileName); // Save file as userId_messageIndex.extension
//   },
// });

// const upload = multer({ storage: storage }).single("file");

// Handle file upload
// app.post("/upload", upload, (req, res) => {
//   console.log(req.body);
//   // Set up the storage configuration for multer

//   // Initialize multer with the storage configuration

//   // upload(req, res, (err) => {
//   //   if (err) {
//   //     console.log(err);
//   //     return res.end("Error uploading file.");
//   //   }
//   //   res.end("File has been uploaded");
//   // });
//   if (req.file) {
//     //console.log("File uploaded successfully:", req.file);
//     console.
//     (req.body);
//     res.json({ message: "File uploaded successfully", file: req.file });
//   } else {
//     res.status(400).json({ message: "File upload failed" });
//   }
// });

app.get("/load_file", (req, res) => {
  // const fileName = req.params.fileName;
  // const userID = req.params.userID;
  // const message_index = req.params.message_index;
  const { userID, message_index, fileName } = req.query;
  const fileDetail = `${userID}_${message_index}_${fileName}`;
  const filePath = path.resolve("../uploads", fileDetail);

  console.log(filePath);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    }
  });
});

let userId;
let messageIndex;

app.post("/upload_id", (req, res) => {
  console.log(req.body);
  userId = req.body.userID;
  messageIndex = req.body.message_index;
  res.status(200).json({ message: "upload_id updated" });
});

app.post("/upload", (req, res) => {
  const bb = busboy({ headers: req.headers });

  // bb.on("field", (fieldname, val) => {
  //   // Capture userId and messageIndex
  //   if (fieldname === "userID") {
  //     userId = val;
  //   } else if (fieldname === "message_index") {
  //     messageIndex = val;
  //   }
  // });

  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("Uploading:", filename);
    const uploadPath = path.join(
      "..",
      "uploads",
      `${userId}_${messageIndex}_${filename.filename}`
    );
    const writeStream = fs.createWriteStream(uploadPath);
    file.pipe(writeStream);
  });

  bb.on("finish", () => {
    res.status(200).json({ message: "Upload complete" });
  });

  return req.pipe(bb);
});

// Dummy user (in a real app, you'd query a database)
const users = [
  { username: "user1", password: bcrypt.hashSync("password123", 10) },
];

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM userbase");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/updatemessages", async (req, res) => {
  const { id, message_text, file_text } = req.body;

  try {
    await pool.query(
      "INSERT INTO userdata (user_id, item_message, item_filename) VALUES ($1, $2, $3)",
      [id, message_text, file_text]
    );
    res.json({ message: "Insert complete" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to find the user by ID
    const result = await pool.query(
      "SELECT * FROM userbase WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    // const passwordMatch = bcrypt.compareSync(password, user.password);

    // if (!passwordMatch) {
    //   return res.status(401).json({ message: "Invalid password" });
    // }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    try {
      const messages = await pool.query(
        "SELECT * FROM userdata WHERE user_id = $1",
        [user.id]
      );

      let messagesArr = [];
      messages.rows.forEach((row, index) => {
        const messageObj = {
          text: row.item_message,
          fileItem: {
            fileName: row.item_filename,
            url: "https://www.google.ca/",
          },
        };
        messagesArr.push(messageObj);
      });

      // Send success response
      res.json({
        status: "Login successful",
        messagesData: messagesArr,
        id: user.id,
        token,
      });
    } catch (error) {
      console.log(error);
    }

    // return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // If token is valid, save decoded info
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
