import express from "express";

import pool from "../db.js";

const router = express.Router();

router.post("/updatemessages", async (req, res) => {
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

export default router;
