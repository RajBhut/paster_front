import React from "react";
import { useContext, useState } from "react";

export default function Loginc() {
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [mode, setmode] = useState("signup");
  const [confirmPassword, setconfirmPassword] = useState("");
  const login = async () => {
    setloading(true);

    if (mode === "signup") {
      seterror("");
      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email,
            password,
          }),
        });
        const data = await res.json();
        setloading(false);
        if (data.error) {
          seterror(data.error);
        } else {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror("something went wrong");
      }
    } else {
      seterror("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "center",
          gap: "10px",
          border: "1px solid black",
          padding: "10px",
          "border-radius": "10px",
        }}
      >
        <input
          type="text"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode != "signup" && (
          <input
            type="text"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        )}

        <button onClick={login}>Enter</button>
      </div>
      <div>
        <button
          onClick={() =>
            setmode((prv) => {
              if (prv == "signup") return "login";
              else return "signup";
            })
          }
        >
          {mode}
        </button>
      </div>
    </div>
  );
}
