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
    //console.log(uploadedFile);
    const newFile = {
      fileName: uploadedFile.name,
      //fileData: uploadedFile,
      url: URL.createObjectURL(uploadedFile), // Create a URL for each file
    };
    setCurrentFile(newFile);
  };

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note.trim() || currentFile.fileName) {
      if (currentFile.fileName) {
        try {
          await axios.post("http://localhost:5000/upload_id", {
            userID: currentUser,
            message_index: messages.length,
          });
        } catch (error) {
          console.error(error);
        }

        var fileToSend = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", fileInputRef.current.files[0]);
        formData.append("userID", currentUser);
        formData.append("message_index", messages.length); // Send message index

        try {
          const result = await axios.post(
            "http://localhost:5000/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }, // Important for file upload
            }
          );
          console.log(result.data);
        } catch (error) {
          console.error(error);
        }
      }

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
        //console.log(currentFile.fileName);
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
        <a href={currentFile.url} download={currentFile.fileName}>
          {currentFile.fileName}
        </a>
        <button type="submit" className={styles.sendBtn}>
          Send
        </button>
      </form>
    </div>
  );
}

export default TextInput;
