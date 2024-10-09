import { useState } from "react";
import styles from "../styles/FileUpload.module.css";

function FileUpload() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file), // Create a URL for each file
    }));
    setFiles([...files, ...newFiles]); // Add new files to the state
  };

  return (
    <div className={styles.fileUploadContainer}>
      <input
        type="file"
        multiple
        className={styles.fileInput}
        onChange={handleFileChange}
      />
      <ul className={styles.fileList}>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((fileObj, index) => (
            <li key={index} className={styles.fileItem}>
              {fileObj.file.name}
              <a
                href={fileObj.url}
                download={fileObj.file.name}
                className={styles.downloadLink}
              >
                Download
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default FileUpload;
