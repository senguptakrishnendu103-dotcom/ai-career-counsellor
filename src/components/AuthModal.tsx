"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, mode, setMode }) => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "mentor" | "admin">("student");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message ?? "Login failed");
      else onClose();
    } else {
      const { error } = await signUp(email, password, { role, name });
      if (error) setError(error.message ?? "Sign-up failed");
      else setInfo("Verification email sent. Please check your inbox.");
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email to reset password");
      return;
    }
    const { error } = await resetPassword(email);
    if (error) setError(error.message ?? "Reset failed");
    else setInfo("Password reset link sent to your email.");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
        <h2 className="mb-4 text-center text-2xl font-semibold text-white">
          {mode === "login" ? "Log In" : "Sign Up"}
        </h2>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        {info && <p className="mb-2 text-sm text-green-400">{info}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-purple-600 py-2 font-medium text-white hover:bg-purple-500 disabled:opacity-50"
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="underline hover:text-white"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="underline hover:text-white"
              >
                Log In
              </button>
            </p>
          )}
          {mode === "login" && (
            <button onClick={handleReset} className="underline hover:text-white">
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
