// src/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../Context";
import styles from "../styles/Login.module.css";

function Signup() {
  const {
    token,
    setToken,
    currentUser,
    setCurrentUser,
    setMessages,
    setLogin,
    api,
  } = useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState(0);
  const [status, setStatus] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}signup`, {
        username,
        password,
      });
      setErr(response.data.error);
      setStatus(response.data.message);
      console.log(status);
      if (response.data.token) {
        setToken(response.data.token);
      }
      setCurrentUser(response.data.id);
      console.log(response.data);
    } catch (error) {
      console.log("Signup failed");
    }
  };

  return (
    <div className={styles.loginScreen}>
      <div className={styles.loginContainer}>
        <h1>Signup</h1>
        <div className={styles.loginForm}>
          <div className={styles.error}>{err ? <p>{status}</p> : <></>}</div>
          <form onSubmit={handleSignup}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit">Signup</button>
              <button
                className={styles.setSignup}
                onClick={() => {
                  setLogin(true);
                }}
                type="button"
              >
                {" "}
                Login instead?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
