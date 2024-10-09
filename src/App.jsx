import { useState, useEffect } from "react";
import axios from "axios";

import styles from "./styles/App.module.css";
import Navbar from "./components/Navbar";
import TextInput from "./components/TextInput";
import Login from "./components/Login";
import MessageDisplay from "./components/MessageDisplay";
import FileUpload from "./components/FileUpload";

function App() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true); // To show a loading state

  // Check if token exists when the app loads
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/check-token", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setToken(response.data.token); // If valid token is returned, set it
      } catch (error) {
        setToken(null); // If no token or invalid, ensure token is null
      } finally {
        setIsLoading(false); // Loading state ends
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.App}>
      <Navbar />
      {token ? (
        <>
          <MessageDisplay />
          <TextInput />
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;
