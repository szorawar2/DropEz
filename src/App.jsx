import { useState, useEffect, useContext } from "react";
import axios from "axios";

import styles from "./styles/App.module.css";
import Navbar from "./components/Navbar";
import TextInput from "./components/TextInput";
import Login from "./components/Login";
import Signup from "./components/signup";
import MessageDisplay from "./components/MessageDisplay";
//import FileUpload from "./components/FileUpload";
import { Context } from "./Context";

function App() {
  const { token, setToken, login, setLogin } = useContext(Context);

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
      ) : login ? (
        <Login />
      ) : (
        <Signup />
      )}
    </div>
  );
}

export default App;
