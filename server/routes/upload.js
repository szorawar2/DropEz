import express from "express";
import busboy from "busboy";
import fs from "fs";
import path from "path";

const router = express.Router();

let userId;
let messageIndex;

// gets file prefix values before saving
router.post("/upload_id", (req, res) => {
  console.log(req.body);
  userId = req.body.userID;
  messageIndex = req.body.message_index;
  res.status(200).json({ message: "upload_id updated" });
});

router.post("/upload", (req, res) => {
  const bb = busboy({ headers: req.headers });

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

export default router;
