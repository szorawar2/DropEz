import { google } from "googleapis";
import path from "path";
import fs from "fs";

let ACCESS_TOKEN =
  "ya29.a0AcM612x0Dcafj6IzULsSdZZCp9z3pyFGhS6x7BnwcrAgxa4japQcJiWeAISUtaFROZd9XGqtsTWjGwqU2Le3bKiyO9y7uuyY0j0KyYvXiEJI3wtPhC7TtK3q0BXs6ObtVnDLLOFgg_D-PXvwhKRcfHNAAq-dmd7w0Oe2tSjKiQaCgYKAQESARESFQHGX2MiLmjbgRbpX4JunlKKNxBDoA0177";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  access_token: ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const filePath = path.join("..", "uploads", "1_0_upload test.txt");

// Helper function to refresh the access token if needed
oauth2Client.on("tokens", (tokens) => {
  if (tokens.access_token) {
    console.log("New Access Token:", tokens.access_token);
    ACCESS_TOKEN = tokens.access_token; // Store the new access token if required
  }
});

async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "upload_test_drive.txt",
        mimeType: "text/plain",
      },
      media: {
        mimeType: "text/plain",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Access token expired, refreshing...");
      await oauth2Client.getAccessToken(); // Refresh the token if it expired
      return uploadFile(); // Retry the upload
    } else {
      console.error("Upload Failed:", error.message);
    }
  }
}

async function downloadFile(fileId) {
  const destPath = path.join("..", "downloads", "downloaded_file.txt");

  try {
    const dest = fs.createWriteStream(destPath); // Create write stream to destination file

    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );

    response.data
      .on("end", () => {
        console.log(`Downloaded file to ${destPath}`);
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
      })
      .pipe(dest); // Pipe the stream to the destination
  } catch (error) {
    console.error("Failed to download file:", error.message);
  }
}

//uploadFile();

const FILE_ID = "1q-TsQflE2iHL3g-Pd_RLQHxwVHBFOkw0";
downloadFile(FILE_ID);
