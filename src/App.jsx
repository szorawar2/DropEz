import { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import styles from "./styles/App.module.css";
import Navbar from "./components/Navbar";
import TextInput from "./components/TextInput";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MessageDisplay from "./components/MessageDisplay";
import ProtectedRoute from "./components/ProtectedRoute";
import { Context } from "./Context";

function App() {
  const { setToken } = useContext(Context);
  const navigate = useNavigate();

  // const [isLoading, setIsLoading] = useState(false); // To show a loading state

  // Check if token exists when the app loads
  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/check-token", {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       });
  //       setToken(response.data.token); // If valid token is returned, set it
  //     } catch (error) {
  //       setToken(null); // If no token or invalid, ensure token is null
  //     } finally {
  //       setIsLoading(false); // Loading state ends
  //     }
  //   };

  //   checkToken();
  // }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    if (location.pathname === "/login") {
      setToken(null); // Clear token on back to login
    }
  }, [location]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // Set token if found in localStorage
      // console.log("stored token:", storedToken);
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  }, [setToken, navigate]);

  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MessageDisplay />
                <TextInput />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
