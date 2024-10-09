import { useState, useContext } from "react";
import styles from "../styles/MessageDisplay.module.css";
import { Context } from "../Context";

function MessageDisplay() {
  const { messages } = useContext(Context);

  return (
    <div className={styles.messageDisplayContainer}>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((messageObj, index) => (
          <div key={index} className={styles.message}>
            {messageObj.text && <p>{messageObj.text}</p>}
            {messageObj.fileItem.fileName && (
              <a
                href={messageObj.fileItem.url}
                download={messageObj.fileItem.fileName}
                className={styles.downloadLink}
              >
                {messageObj.fileItem.fileName}
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MessageDisplay;
