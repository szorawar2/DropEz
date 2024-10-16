import { useContext } from "react";
import styles from "../styles/MessageDisplay.module.css";
import { Context } from "../Context";
import axios from "axios";

function MessageDisplay() {
  const { messages, currentUser } = useContext(Context);

  const handleDownload = async (fileId, fileName) => {
    console.log(fileId);
    console.log(fileName);
    try {
      const response = await axios.get("http://localhost:5000/load_file", {
        params: {
          // userID: user,
          // message_index: index,
          // fileName: fileName,
          fileId: fileId,
        },
        responseType: "blob", // Ensures binary data is handled correctly
      });

      const fileURL = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileURL); // Clean up the object URL
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className={styles.messageDisplayContainer}>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((messageObj, index) => (
          <div key={index} className={styles.message}>
            {messageObj.text && <p>{messageObj.text}</p>}
            {messageObj.fileItem.fileName && (
              <button
                className={styles.downloadButton}
                onClick={() =>
                  handleDownload(
                    messageObj.fileItem.fileId,
                    messageObj.fileItem.fileName
                  )
                }
              >
                Download {messageObj.fileItem.fileName}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MessageDisplay;
