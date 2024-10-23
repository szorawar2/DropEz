// src/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../Context";
import styles from "../styles/Login.module.css";

function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}login`, {
        username,
        password,
      });
      setToken(response.data.token); // Pass the token to the parent component
      //console.log(response.data);
      console.log("Login succesful");
      setCurrentUser(response.data.id);
      setMessages(response.data.messagesData);
      setErr(response.data.error);
      setStatus(response.data.status);
    } catch (error) {
      console.log("Login failed");
    }
  };

  return (
    <div className={styles.loginScreen}>
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <div className={styles.loginForm}>
          <div>{err ? <p className={styles.error}>{status}</p> : <></>}</div>
          <form onSubmit={handleLogin}>
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
              <button className={styles.loginButton} type="submit">
                Login
              </button>
              <button
                className={styles.setSignup}
                onClick={() => {
                  setLogin(false);
                }}
                type="button"
              >
                {" "}
                Signup instead?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
