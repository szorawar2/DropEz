import express from "express";
import path from "path";

const router = express.Router();

router.get("/load_file", (req, res) => {
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

export default router;
