import React, { useContext, useEffect, useState } from "react";
import { Usercontext } from "./UsrProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Loginc() {
  const { setuser, user } = useContext(Usercontext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setmode] = useState("signup");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setuser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const loginOrSignup = async () => {
    setloading(true);

    if (!email || !password) {
      seterror("Please fill all the fields");
      setloading(false);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      seterror("Passwords do not match");
      setloading(false);
      return;
    }

    const endpoint = mode === "signup" ? "/user/" : "/user/login";
    try {
      const res = await axios.post(`https://past-back.vercel.app${endpoint}`, {
        email,
        password,
        name,
      });
      const data = await res.data;
      setloading(false);

      if (data.error) {
        seterror(data.error);
      } else {
        setuser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      }
    } catch (error) {
      setloading(false);
      seterror("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          border: "1px solid black",

          borderRadius: "10px",
          padding: "40px",
        }}
      >
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "signup" && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </>
        )}
        <button onClick={loginOrSignup}>
          {loading ? "Loading..." : mode === "signup" ? "Sign Up" : "Log In"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <button
        onClick={() =>
          setmode((prev) => (prev === "signup" ? "login" : "signup"))
        }
      >
        Switch to {mode === "signup" ? "Login" : "Sign Up"}
      </button>
      {user && (
        <Link to="/home">
          {" "}
          <button style={{ backgroundColor: "white", color: "black" }}>
            Home
          </button>
        </Link>
      )}
    </div>
  );
}
