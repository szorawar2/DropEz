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

  const [driveID, setDriveID] = useState("");

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

        try {
          const result = await axios.post(
            "http://localhost:5000/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }, // Important for file upload
            }
          );
          console.log(result.data);
          setDriveID(result.data.file_driveId);
          //console.log(driveID);

          setMessages([
            ...messages,
            { text: note, fileItem: { fileName: currentFile.fileName } },
          ]); // Add message and files
          try {
            const result = await axios.post(
              "http://localhost:5000/updatemessages",
              {
                id: currentUser,
                message_text: note,
                file_text: currentFile.fileName,
                file_driveId: driveID,
              }
            );
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.error(error);
        }
      }

      // //Load file
      // try {
      //   const response = await axios.get(`http://localhost:5000/load_file`, {
      //     params: {
      //       userID: 1,
      //       message_index: 1,
      //       fileName: "upload test.txt",
      //     },
      //     responseType: "blob", // If the file is a blob (e.g., image, text, etc.)
      //   });

      //   // If it's a file, create an object URL and set it to the state
      //   const fileURL = URL.createObjectURL(new Blob([response.data]));

      //   // You can now display the file in the frontend (e.g., set the src of an img or a link to download)
      //   console.log("File URL:", fileURL);
      //   //return fileURL;
      // } catch (error) {
      //   console.error("Error fetching file:", error);
      // }

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
