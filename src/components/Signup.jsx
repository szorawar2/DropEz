// src/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../Context";

function Signup() {
  const {
    token,
    setToken,
    currentUser,
    setCurrentUser,
    setMessages,
    setLogin,
  } = useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState(0);
  const [status, setStatus] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
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
    <div>
      <h1>Signup</h1>
      <div>
        {err ? (
          <p style={{ color: "var(--secondary-color)" }}>{status}</p>
        ) : (
          <></>
        )}
      </div>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Signup</button>
        <button
          onClick={() => {
            setLogin(true);
          }}
          type="button"
        >
          {" "}
          Login instead?
        </button>
      </form>
    </div>
  );
}

export default Signup;
