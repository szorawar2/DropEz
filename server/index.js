// server/index.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

import pool from "./db.js";

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_jwt_secret_key"; // Keep this secure and hidden in env variables

// Middleware
app.use(cors()); // Allow React to communicate with Node
app.use(bodyParser.json()); // Parse incoming JSON requests

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

    // const messages = await pool.query(
    //   "SELCT * FROM userdata WHERE user_id = $1",
    //   [user.id]
    // );

    // let messagesArr = [];
    // messages.rows.forEach((row, index) => {
    //   const messageObj = {
    //     text: row.item_message,
    //     fileItem: {
    //       fileName: row.item_filename,
    //       url: "https://www.google.ca/",
    //     },
    //   };
    //   messagesArr.push(messageObj);
    // });

    // // Send success response
    // res.json({
    //   status: "Login successful",
    //   messagesData: messagesArr,
    //   id: user.id,
    //   token,
    // });

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

// Login route
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username);

//   if (user && bcrypt.compareSync(password, user.password)) {
//     // Generate JWT token
//     const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
//     return res.json({ token });
//   }

//   res.status(401).json({ message: "Invalid credentials" });
// });

// // Token verification middleware
// function verifyToken(req, res, next) {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).json({ message: "No token provided" });

//   jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
//     if (err)
//       return res.status(500).json({ message: "Failed to authenticate token" });
//     req.user = decoded;
//     next();
//   });
// }

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
