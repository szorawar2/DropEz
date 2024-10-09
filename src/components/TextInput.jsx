import { useState, useContext, useRef } from "react";
import MessageDisplay from "./MessageDisplay";
import styles from "../styles/TextInput.module.css";
import { Context } from "../Context";
import axios from "axios";

function TextInput() {
  const {
    note,
    setNote,
    messages,
    setMessages,
    currentFile,
    setCurrentFile,
    currentUser,
  } = useContext(Context);

  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    const uploadedFile = e.target.files[0]; //Target data
    const newFile = {
      fileName: uploadedFile.name,
      //fileData: uploadedFile,
      url: URL.createObjectURL(uploadedFile), // Create a URL for each file
    };
    setCurrentFile(newFile);
    console.log(currentFile);
  };

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note.trim() || currentFile.fileName) {
      setMessages([...messages, { text: note, fileItem: currentFile }]); // Add message and files
      try {
        const result = await axios.post(
          "http://localhost:5000/updatemessages",
          {
            id: currentUser,
            message_text: note,
            file_text: currentFile.fileName,
          }
        );
        //console.log(result.data);
        console.log(currentFile.fileName);
      } catch (error) {
        console.error(error);
      }
      setNote(""); // Clear message input
      setCurrentFile({ fileName: "" }); // Clear files after submission
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.textInputContainer}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          className={styles.textArea}
          value={note}
          onChange={handleChange}
          placeholder="Type a message..."
        />
        <input
          type="file"
          className={styles.fileInput}
          onInput={handleFileInput}
          ref={fileInputRef}
        />
        <button type="submit" className={styles.sendBtn}>
          Send
        </button>
      </form>
    </div>
  );
}

export default TextInput;
