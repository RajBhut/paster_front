import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UsrProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Mail, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Loginc() {
  const { setuser, user } = useContext(UserContext);
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
      const res = await axios.post(`${API_URL}${endpoint}`, {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "signup" ? "Start your journey" : "Sign in to continue"}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={loginOrSignup}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                {mode === "signup" ? "Sign Up" : "Log In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() =>
                setmode((prev) => (prev === "signup" ? "login" : "signup"))
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {mode === "signup"
                ? "Already have an account? Log in"
                : "Need an account? Sign up"}
            </button>
          </div>

          {user && (
            <Link
              to="/home"
              className="block text-center mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Return to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
