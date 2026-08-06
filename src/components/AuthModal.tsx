"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, mode, setMode }) => {
  const { signIn, signUp, signInWithOAuth, sendMagicLink, resetPassword } = useAuth();
  
  const [authType, setAuthType] = useState<"password" | "magiclink">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "mentor" | "admin">("student");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!open) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfo(null);
    setIsSubmitting(true);
    const { error } = await signInWithOAuth("google");
    if (error) {
      setError(error.message ?? "Google sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendMagicLink(email.trim());
    setIsSubmitting(false);

    if (error) {
      setError(error.message ?? "Could not send magic link.");
    } else {
      setInfo("✨ Instant login link sent! Check your email inbox to sign in without a password.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "login") {
      const { error } = await signIn(email.trim(), password);
      setIsSubmitting(false);
      if (error) {
        if (error.message?.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Try resetting your password if you forgot it.");
        } else {
          setError(error.message ?? "Login failed. Please try again.");
        }
      } else {
        onClose();
      }
    } else {
      const { error } = await signUp(email.trim(), password, { role, name });
      setIsSubmitting(false);
      if (error) {
        setError(error.message ?? "Sign-up failed.");
      } else {
        setInfo("🎉 Account created! Please check your email to verify your address.");
      }
    }
  };

  const handleReset = async () => {
    setError(null);
    setInfo(null);
    if (!email || !email.includes("@")) {
      setError("Enter your email address above to request a password reset.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (error) {
      setError(error.message ?? "Reset failed");
    } else {
      setInfo("🔑 Password reset link sent to your email.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Decorative Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Secure & Private Authentication</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === "login" ? "Welcome Back to CareerVerse" : "Join CareerVerse AI"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login"
              ? "Access your personalized AI career guidance and assessments"
              : "Start building your AI-driven career path today"}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">✅</span>
            <span>{info}</span>
          </div>
        )}

        {/* One-Click Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full mb-4 flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zm0 0"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500">or use email</span>
          </div>
        </div>

        {/* Method Toggle: Password vs Passwordless Magic Link (for login mode) */}
        {mode === "login" && (
          <div className="flex rounded-lg bg-slate-950 p-1 mb-4 border border-slate-800">
            <button
              type="button"
              onClick={() => setAuthType("password")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                authType === "password"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthType("magiclink")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                authType === "magiclink"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ✨ Passwordless Magic Link
            </button>
          </div>
        )}

        {/* Forms */}
        {authType === "magiclink" && mode === "login" ? (
          /* Passwordless Magic Link Form */
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send One-Click Magic Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Standard Password Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">I am joining as a</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="student">Student / Job Seeker</option>
                    <option value="mentor">Career Mentor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-all shadow-md shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        {/* Sub-Actions */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          {mode === "login" ? (
            <p>
              New here?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setInfo(null);
                }}
                className="font-medium text-purple-400 hover:underline hover:text-purple-300"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setInfo(null);
                }}
                className="font-medium text-purple-400 hover:underline hover:text-purple-300"
              >
                Log In
              </button>
            </p>
          )}

          {mode === "login" && (
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-white hover:underline transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Privacy & Security Guarantee Banner */}
        <div className="mt-6 rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-300">Privacy First:</strong> Your profile, career data, and counselor chats are encrypted and completely confidential. We never share or sell your data.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
