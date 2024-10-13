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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setToken(response.data.token); // Pass the token to the parent component
      //console.log(response.data);
      console.log("Login succesful");
      setCurrentUser(response.data.id);
      setMessages(response.data.messagesData);
    } catch (error) {
      console.log("Login failed");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
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
