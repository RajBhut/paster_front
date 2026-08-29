import React, { useContext, useEffect, useState } from "react";
import { Usercontext } from "./UsrProvider";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useLogin, useSignup } from "@/hooks/useAuth";
import type { User as UserType } from "@/types";

type AuthMode = "login" | "signup";

export default function Loginc() {
  const { setuser, user } = useContext(Usercontext);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const isLoading = loginMutation.isPending || signupMutation.isPending;

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const validate = (): string => {
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    if (mode === "signup") {
      if (!name.trim()) return "Name is required.";
      if (password !== confirmPassword) return "Passwords do not match.";
      if (password.length < 6) return "Password must be at least 6 characters.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) { setError(msg); return; }

    try {
      let data: UserType;
      if (mode === "login") {
        data = await loginMutation.mutateAsync({ email: email.trim(), password });
      } else {
        data = await signupMutation.mutateAsync({ email: email.trim(), password, name: name.trim() });
      }
      const asErr = data as unknown as { error?: string };
      if (asErr.error) {
        setError(asErr.error);
      } else {
        setuser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      }
    } catch {
      setError("Request failed. Check your connection and try again.");
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
  };

  return (
    <div className="min-h-screen bg-surface-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Product identity */}
        <div className="mb-8">
          <span className="text-xs font-mono text-ink-3 uppercase tracking-widest">Paster</span>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-ink-3">
            {mode === "login"
              ? "Enter your credentials to continue."
              : "Fill in your details to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                autoFocus
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoFocus={mode === "login"}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "login" ? "Your password" : "At least 6 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          {mode === "signup" && (
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded bg-danger-subtle border border-danger/20 text-danger text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-1"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading
              ? mode === "login" ? "Signing in…" : "Creating account…"
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="divider" />

        <p className="text-xs text-ink-3 text-center">
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-accent hover:underline font-medium"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
