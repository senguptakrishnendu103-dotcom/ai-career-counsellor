"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ChevronDown, Globe } from "lucide-react";

export default function GoogleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [loading, setLoading] = useState(false);
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Enter an email or phone number");
      return;
    }
    
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()) && email.trim().length < 5) {
      setEmailError("Enter a valid email address");
      return;
    }

    setLoading(true);
    // Simulate authentic Google verification delay
    setTimeout(() => {
      setLoading(false);
      setStep("password");
    }, 8000);
  };

  const handlePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!password.trim()) {
      setPasswordError("Enter a password");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Wrong password. Try again or click Forgot password to reset it.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Create user session and save it in localStorage
      const displayName = email.split("@")[0];
      const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      
      const userData = {
        name: capitalizedName,
        email: email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
        streak: 1,
        role: email.includes("admin") ? "admin" : "user",
        savedCareers: [],
        assessmentHistory: [],
        completedSteps: 0,
        totalSteps: 15,
        goals: ["Get a remote AI Software Engineer job", "Build an open-source React library", "Pass AWS Solutions Architect certification"],
        skills: ["React/Next.js", "TypeScript", "Python", "Tailwind CSS", "REST APIs"],
        weakAreas: ["System Design", "Algorithms & Data Structures", "Public Speaking"],
        certifications: ["AWS Certified Cloud Practitioner", "Google Data Analytics Professional Cert"],
        readinessScore: 82,
        confidenceScore: 85,
        weeklyProgress: [40, 60, 45, 80, 55, 95, 82],
        placementReady: true,
        trackerJobs: [
          { company: "Vercel", role: "Junior Frontend Engineer", status: "Applied", date: "2026-07-28" },
          { company: "Stripe", role: "Software Engineer Intern", status: "Interviewing", date: "2026-07-25" }
        ],
        studyHours: 20,
        consistencyScore: 92,
        completionPercentage: 72,
        missions: [
          { id: 1, task: "Complete Next.js routing course module", completed: true },
          { id: 2, task: "Upload and analyze resume with ATS reviewer", completed: true },
          { id: 3, task: "Practice one AI behavioral interview session", completed: false }
        ],
        interviewHistory: [
          { role: "Frontend Developer", type: "Technical", date: "2026-07-29", score: 85, feedback: "Great React knowledge. Needs slight improvement in CSS grid/flexbox edge cases." }
        ]
      };
      
      localStorage.setItem("careerverse_user", JSON.stringify(userData));
      
      // Navigate back to the career OS
      router.push("/");
    }, 1200);
  };

  return (
    <div className="relative z-50 flex flex-col justify-between items-center w-full min-h-screen bg-[#f0f4f9] text-[#202124] font-sans antialiased px-4 pt-[10vh] pb-6">
      
      {/* Centered Auth Card */}
      <div className="w-full max-w-[450px] bg-white border border-[#dadce0] rounded-lg md:rounded-lg overflow-hidden p-6 md:p-10 shadow-sm flex flex-col justify-between min-h-[500px]">
        
        {/* Top Loading Progress Line */}
        <div className="h-[4px] w-full -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-6 bg-transparent relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-[#e8f0fe]">
              <motion.div
                className="h-full bg-[#1a73e8] rounded"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut"
                }}
                style={{ width: "50%" }}
              />
            </div>
          )}
        </div>

        <div>
          {/* Google Logo */}
          <div className="flex justify-start mb-6">
            <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zm0 0"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="text-left"
              >
                <h1 className="text-[24px] font-normal leading-8 text-[#202124] mb-2">Sign in</h1>
                <p className="text-[16px] font-normal text-[#202124] mb-7">to continue to CareerVerse</p>

                <form onSubmit={handleEmailNext}>
                  {/* Floating Outline Input */}
                  <div className="relative w-full mb-2">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className={`w-full px-3.5 py-4 text-base bg-transparent border rounded-[4px] outline-none transition-all ${
                        emailError
                          ? "border-[#d93025] focus:border-[#d93025]"
                          : emailFocused || email
                          ? "border-[#1a73e8] focus:border-[#1a73e8] border-2"
                          : "border-[#dadce0] hover:border-gray-400"
                      } text-[#202124]`}
                      style={{ height: "56px" }}
                      autoFocus
                    />
                    <label
                      className={`absolute left-3.5 transition-all pointer-events-none px-1.5 bg-white ${
                        emailFocused || email
                          ? "-top-2 text-xs text-[#1a73e8]"
                          : "top-4 text-base text-[#5f6368]"
                      } ${emailError ? "text-[#d93025] focus:text-[#d93025]" : ""}`}
                    >
                      Email or phone
                    </label>
                  </div>

                  {/* Error display */}
                  {emailError && (
                    <div className="text-[12px] text-[#d93025] flex items-center gap-1.5 mb-6 px-1">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      {emailError}
                    </div>
                  )}

                  <div className="mb-8 mt-2">
                    <button
                      type="button"
                      className="text-[14px] font-semibold text-[#1a73e8] hover:text-[#174ea6] transition-colors hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot email?
                    </button>
                  </div>

                  <p className="text-[14px] text-[#5f6368] leading-5 mb-8">
                    Not your computer? Use Guest mode to sign in privately.{" "}
                    <span className="text-[#1a73e8] font-semibold hover:underline cursor-pointer">Learn more</span>
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={() => alert("Mock Account creation flow is disabled.")}
                      className="text-[14px] font-semibold text-[#1a73e8] hover:bg-[#f8fafd] px-4 py-2.5 rounded transition-all cursor-pointer"
                    >
                      Create account
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#1a73e8] hover:bg-[#1b66ca] text-white text-[14px] font-semibold px-6 py-2.5 rounded-[4px] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8] disabled:opacity-50 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="text-left"
              >
                {/* Profile Chip */}
                <div
                  onClick={() => setStep("email")}
                  className="inline-flex items-center gap-2 border border-[#dadce0] rounded-full pl-2 pr-3 py-1 mb-6 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xs font-bold text-[#1a73e8]">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-[#3c4043] font-medium max-w-[200px] truncate">{email}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>

                <h1 className="text-[24px] font-normal leading-8 text-[#202124] mb-2">Welcome</h1>
                <p className="text-[16px] text-slate-500 mb-6">Enter password to finalize login</p>

                <form onSubmit={handlePasswordNext}>
                  {/* Password Floating Outline Input */}
                  <div className="relative w-full mb-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className={`w-full px-3.5 pr-11 py-4 text-base bg-transparent border rounded-[4px] outline-none transition-all ${
                        passwordError
                          ? "border-[#d93025] focus:border-[#d93025]"
                          : passwordFocused || password
                          ? "border-[#1a73e8] focus:border-[#1a73e8] border-2"
                          : "border-[#dadce0] hover:border-gray-400"
                      } text-[#202124]`}
                      style={{ height: "56px" }}
                      autoFocus
                    />
                    <label
                      className={`absolute left-3.5 transition-all pointer-events-none px-1.5 bg-white ${
                        passwordFocused || password
                          ? "-top-2 text-xs text-[#1a73e8]"
                          : "top-4 text-base text-[#5f6368]"
                      } ${passwordError ? "text-[#d93025] focus:text-[#d93025]" : ""}`}
                    >
                      Enter your password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Error display */}
                  {passwordError && (
                    <div className="text-[12px] text-[#d93025] flex items-start gap-1.5 mb-6 px-1 leading-snug">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Show password check */}
                  <div className="flex items-center gap-3 mb-8 mt-4 pl-1">
                    <input
                      type="checkbox"
                      id="showPass"
                      checked={showPassword}
                      onChange={() => setShowPassword(prev => !prev)}
                      className="w-4 h-4 rounded border-gray-300 text-[#1a73e8] focus:ring-[#1a73e8] cursor-pointer"
                    />
                    <label htmlFor="showPass" className="text-sm text-[#202124] select-none cursor-pointer">
                      Show password
                    </label>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      className="text-[14px] font-semibold text-[#1a73e8] hover:bg-[#f8fafd] px-4 py-2.5 rounded transition-all cursor-pointer"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#1a73e8] hover:bg-[#1b66ca] text-white text-[14px] font-semibold px-6 py-2.5 rounded-[4px] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8] disabled:opacity-50 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Google Footer */}
      <footer className="w-full max-w-[900px] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#5f6368] px-4 mt-8">
        
        {/* Language selector */}
        <div className="flex items-center gap-1 hover:bg-[#e8eaed]/50 pl-3 pr-2 py-2 rounded-[4px] cursor-pointer transition-colors text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>English (United States)</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="hover:bg-[#e8eaed]/50 px-3 py-2 rounded-[4px] transition-colors">Help</a>
          <a href="#" className="hover:bg-[#e8eaed]/50 px-3 py-2 rounded-[4px] transition-colors">Privacy</a>
          <a href="#" className="hover:bg-[#e8eaed]/50 px-3 py-2 rounded-[4px] transition-colors">Terms</a>
        </div>
      </footer>

    </div>
  );
}
