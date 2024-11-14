import React, { useContext, useState } from "react";
import { Usercontext } from "./UsrProvider";
import { useNavigate } from "react-router-dom";

export default function Loginc() {
  const { setuser } = useContext(Usercontext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setmode] = useState("signup");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();

  const loginOrSignup = async () => {
    setloading(true);

    if (mode === "signup" && password !== confirmPassword) {
      seterror("Passwords do not match");
      setloading(false);
      return;
    }

    const endpoint = mode === "signup" ? "/user/" : "/user/login";
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });
      const data = await res.json();
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
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          border: "1px solid black",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
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
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
    </div>
  );
}
