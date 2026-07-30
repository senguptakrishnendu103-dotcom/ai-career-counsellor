"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  UploadCloud,
  Compass,
  BookOpen,
  TrendingUp,
  BarChart3,
  MessageSquare,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Play,
  Lock,
  Award,
  Flame,
  Calendar,
  Newspaper,
  Search,
  Check,
  Send,
  HelpCircle,
  Users,
  Briefcase,
  GraduationCap
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

// ================= TYPES & MOCKS =================
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  streak: number;
  role: "user" | "admin";
  savedCareers: string[];
  assessmentHistory: { date: string; result: string }[];
  completedSteps: number;
  totalSteps: number;
}

const mockBlogs = [
  {
    id: 1,
    title: "AI Trends in 2026: The Rise of Agentic Workflows",
    category: "AI News",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    excerpt: "Discover how autonomous AI agents are redefining roles in software engineering, data science, and project management."
  },
  {
    id: 2,
    title: "Top 10 Global Internships for Tech Undergrads",
    category: "Internships",
    date: "July 25, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    excerpt: "A comprehensive guide to applying for elite remote and hybrid internships at Stripe, Linear, and Vercel."
  },
  {
    id: 3,
    title: "Google Generation Scholarship 2027 Guidelines",
    category: "Scholarships",
    date: "July 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
    excerpt: "Everything you need to prepare for the Google Generation Scholarship, including essay prompts and interview tips."
  }
];

const mockLearningResources = [
  { id: 1, title: "Harvard CS50: Introduction to Computer Science", provider: "edX / YouTube", rating: "4.9 ★", difficulty: "Beginner", link: "https://pll.harvard.edu/course/cs50-introduction-computer-science" },
  { id: 2, title: "Google Data Analytics Professional Certificate", provider: "Coursera", rating: "4.8 ★", difficulty: "Beginner", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
  { id: 3, title: "Next.js 15 & React 19 Mastery Course", provider: "Udemy", rating: "4.7 ★", difficulty: "Intermediate", link: "https://nextjs.org/learn" },
  { id: 4, title: "MIT 6.006: Introduction to Algorithms", provider: "MIT OCW", rating: "4.9 ★", difficulty: "Advanced", link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
  { id: 5, title: "Kaggle Micro-Courses: Machine Learning", provider: "Kaggle", rating: "4.8 ★", difficulty: "Beginner", link: "https://www.kaggle.com/learn" }
];

export default function CareerCounsellor() {
  // ================= GENERAL APP STATE =================
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  
  // Auth state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [user, setUser] = useState<UserProfile | null>({
    name: "Akash Sengupta",
    email: "akash@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    streak: 5,
    role: "user",
    savedCareers: ["AI Research Scientist", "Product Designer"],
    assessmentHistory: [
      { date: "2026-07-28", result: "Software Engineer" },
      { date: "2026-07-30", result: "AI Research Scientist" }
    ],
    completedSteps: 12,
    totalSteps: 20
  });

  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: authForm.name || "Akash Sengupta",
      email: authForm.email || "akash@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
      streak: 1,
      role: authForm.email.includes("admin") ? "admin" : "user",
      savedCareers: [],
      assessmentHistory: [],
      completedSteps: 0,
      totalSteps: 15
    });
    setAuthModalOpen(false);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("landing");
  };

  // ================= INTERACTIVE ASSESSMENT STATE =================
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState({
    tech: 5,
    data: 5,
    design: 5,
    business: 5,
    workStyle: "Collaborative",
    academics: "Strong",
    strengths: "Problem solving",
    weaknesses: "Public speaking",
    goals: "Building AI tools"
  });

  const quizQuestions = [
    {
      q: "How passionate are you about writing code and engineering software?",
      field: "tech",
      type: "scale"
    },
    {
      q: "Do you enjoy analyzing datasets, discovering patterns, and running statistics?",
      field: "data",
      type: "scale"
    },
    {
      q: "Are you drawn to UI aesthetics, typography, branding, and user experiences?",
      field: "design",
      type: "scale"
    },
    {
      q: "Do you prefer leading teams, managing client relations, and designing business strategy?",
      field: "business",
      type: "scale"
    },
    {
      q: "What is your preferred work style environment?",
      field: "workStyle",
      type: "select",
      options: ["Highly Collaborative", "Independent/Autonomous", "Structured & Policy-driven", "Fast-paced/Startup"]
    },
    {
      q: "How would you describe your academic track record?",
      field: "academics",
      type: "select",
      options: ["Top Performer / Dean's List", "Strong / Above Average", "Consistent / Middle tier", "Non-traditional / Self-taught"]
    },
    {
      q: "What is your absolute biggest strength?",
      field: "strengths",
      type: "text",
      placeholder: "e.g. Critical thinking, visual communication, negotiation..."
    },
    {
      q: "What is your main weakness that you seek to improve?",
      field: "weaknesses",
      type: "text",
      placeholder: "e.g. Stage fright, impatience, micro-managing..."
    },
    {
      q: "What is your long-term primary career goal?",
      field: "goals",
      type: "text",
      placeholder: "e.g. Lead a startup, conduct scientific research, design global brands..."
    }
  ];

  const handleQuizAnswer = (val: any) => {
    setQuizAnswers(prev => ({ ...prev, [quizQuestions[quizStep].field]: val }));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      generatePredictions();
    }
  };

  // Predictor Results state
  const [predictionsLoading, setPredictionsLoading] = useState<boolean>(false);
  const [predictedCareers, setPredictedCareers] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<any | null>(null);

  const generatePredictions = async () => {
    setPredictionsLoading(true);
    setQuizStarted(false); // Hide quiz panel
    try {
      const response = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers })
      });
      const data = await response.json();
      if (response.ok) {
        setPredictedCareers(data);
        // Add to history
        if (user && data[0]) {
          setUser(prev => prev ? ({
            ...prev,
            assessmentHistory: [...prev.assessmentHistory, { date: new Date().toISOString().split('T')[0], result: data[0].role }]
          }) : null);
        }
      } else {
        console.error("Prediction failed:", data.error);
      }
    } catch (err) {
      console.error("Network error during prediction:", err);
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Interest search direct prediction
  const [interestInput, setInterestInput] = useState<string>("");
  const handleInterestSearch = async (term: string) => {
    const searchQuery = term || interestInput;
    if (!searchQuery) return;
    setActiveTab("predictor");
    setPredictionsLoading(true);
    try {
      const response = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest: searchQuery })
      });
      const data = await response.json();
      if (response.ok) {
        setPredictedCareers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPredictionsLoading(false);
    }
  };

  // ================= RESUME ANALYZER STATE =================
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalyzing, setResumeAnalyzing] = useState<boolean>(false);
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<any | null>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeAnalyzing(true);

      const formData = new FormData();
      formData.append("resume", file);

      try {
        const response = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          setResumeAnalysisResult(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setResumeAnalyzing(false);
      }
    }
  };

  // Download improved resume markdown text
  const downloadImprovedResume = () => {
    if (!resumeAnalysisResult?.improvedResumeText) return;
    const element = document.createElement("a");
    const file = new Blob([resumeAnalysisResult.improvedResumeText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${resumeFile?.name.replace(".pdf", "") || "Resume"}_ATS_Optimized.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // ================= ROADMAP GENERATOR STATE =================
  const [roadmapCareer, setRoadmapCareer] = useState<string>("");
  const [roadmapLevel, setRoadmapLevel] = useState<string>("Beginner");
  const [roadmapLoading, setRoadmapLoading] = useState<boolean>(false);
  const [customRoadmap, setCustomRoadmap] = useState<any | null>(null);

  const generateCustomRoadmap = async () => {
    if (!roadmapCareer) return;
    setRoadmapLoading(true);
    try {
      const response = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customRoadmapRequest: {
            careerName: roadmapCareer,
            skillLevel: roadmapLevel
          }
        })
      });
      const data = await response.json();
      if (response.ok) {
        setCustomRoadmap(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  // ================= CHATBOT STATE =================
  const [chatInput, setChatInput] = useState<string>("" );
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: "model",
      content: "Hello! I am your CareerAI Mentor. Ask me any career, college, resume or preparation questions, and let's structure your future today!"
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMessage] })
      });
      const data = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, { role: "model", content: data.response }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ================= ADMIN CONSOLE STATE =================
  const [adminCareers, setAdminCareers] = useState<string[]>([
    "AI Research Scientist",
    "Product Designer",
    "Full Stack Engineer",
    "Data Analyst",
    "DevOps Architect"
  ]);
  const [newCareerInput, setNewCareerInput] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<any[]>([
    { id: 1, user: "Suresh Kumar", email: "suresh@example.com", message: "Amazing assessment tool! The roadmap matches my engineering aspirations." },
    { id: 2, user: "Divya Patel", email: "divya@example.com", message: "The ATS resume reviewer gave me some great formatting tips." }
  ]);

  const addAdminCareer = () => {
    if (newCareerInput.trim()) {
      setAdminCareers(prev => [...prev, newCareerInput.trim()]);
      setNewCareerInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
      {/* ================= FIXED HEADER ================= */}
      <header className="sticky top-0 z-50 w-full py-4 glass-panel border-b border-white/5 rounded-b-2xl mt-2 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("landing")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Career<span className="text-purple-400">AI</span> Pro
          </span>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setActiveTab("landing")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "landing" ? "text-purple-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "learning" ? "text-purple-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Learning Hub
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "blog" ? "text-purple-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Insights Blog
          </button>
          {user && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`text-sm font-medium transition-colors ${
                activeTab === "dashboard" ||
                activeTab === "predictor" ||
                activeTab === "resume" ||
                activeTab === "roadmap" ||
                activeTab === "chatbot"
                  ? "text-purple-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Console Dashboard
            </button>
          )}
        </nav>

        {/* User / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <button
                  onClick={() => setActiveTab("admin")}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold flex items-center gap-1 hover:bg-red-500/20 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Admin
                </button>
              )}
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-purple-500/30 object-cover"
                />
                <span className="text-sm font-medium text-slate-300">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-24 left-4 right-4 z-40 glass-panel border border-white/10 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl"
          >
            <button
              onClick={() => {
                setActiveTab("landing");
                setIsMobileMenuOpen(false);
              }}
              className="py-2 text-left font-medium text-slate-300 hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab("learning");
                setIsMobileMenuOpen(false);
              }}
              className="py-2 text-left font-medium text-slate-300 hover:text-purple-400 transition-colors"
            >
              Learning Hub
            </button>
            <button
              onClick={() => {
                setActiveTab("blog");
                setIsMobileMenuOpen(false);
              }}
              className="py-2 text-left font-medium text-slate-300 hover:text-purple-400 transition-colors"
            >
              Insights Blog
            </button>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-left font-medium text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Console Dashboard
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2 text-left font-medium text-red-300 hover:text-red-400 transition-colors"
                  >
                    Admin Console
                  </button>
                )}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-xs text-red-400 font-medium">
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl border border-white/10 text-center text-sm font-semibold hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-center text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT VIEWS ================= */}
      <main className="flex-1 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          {/* 1. LANDING PAGE VIEW */}
          {activeTab === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-20"
            >
              {/* HERO SECTION */}
              <section className="py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex-1 flex flex-col items-start gap-6 max-w-2xl text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Gemini 1.5 Flash Enabled
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Discover Your Ideal <br className="hidden md:inline" />
                    <span className="gradient-text">Career with AI</span>
                  </h1>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Get personalized career recommendations based on your interests, skills, personality, education and goals. Built like a premium SaaS dashboard for student success.
                  </p>
                  
                  {/* Interest Search Box */}
                  <div className="w-full relative mt-2 max-w-xl flex items-center p-2 rounded-2xl border border-white/10 bg-white/3 focus-within:border-purple-500/50 transition-all">
                    <Search className="w-5 h-5 text-slate-400 ml-3" />
                    <input
                      type="text"
                      placeholder="Describe your interests (e.g., 'I like painting & coding')..."
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInterestSearch("")}
                      className="w-full bg-transparent border-none outline-none py-3 px-4 text-slate-100 placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleInterestSearch("")}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Predict
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => {
                        if (!user) {
                          setAuthModalOpen(true);
                        } else {
                          setActiveTab("predictor");
                          setQuizStarted(true);
                          setQuizStep(0);
                        }
                      }}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-0.5"
                    >
                      Get Started Assessment
                    </button>
                    <button
                      onClick={() => setDemoModalOpen(true)}
                      className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      <Play className="w-4 h-4" /> Watch Demo
                    </button>
                  </div>
                </div>

                {/* Animated AI Illustration */}
                <div className="flex-1 w-full max-w-md relative aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="relative w-80 h-80 rounded-3xl glass-panel-glow border-white/10 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Analyzing Affinities</h3>
                    <p className="text-sm text-slate-400 mb-6">
                      Leveraging LLMs to align your unique qualities with global industry roles.
                    </p>
                    <div className="w-full flex flex-col gap-2">
                      <div className="h-2.5 rounded-full bg-purple-500/10 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Aptitude Match</span>
                        <span>80% Compatibility</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* FEATURES SECTION */}
              <section className="flex flex-col gap-8">
                <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                  <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Career Toolkit</h2>
                  <p className="text-slate-400">
                    A suite of premium SaaS tools to guide every step of your professional journey.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Feature Cards */}
                  {[
                    { title: "AI Career Prediction", desc: "Interactive questionnaires analyzing interest profiles with real Gemini forecasts.", icon: Compass, tab: "predictor" },
                    { title: "Resume Analyzer", desc: "Upload PDFs and receive detailed ATS recommendations and keyword enhancements.", icon: UploadCloud, tab: "resume" },
                    { title: "Roadmap Generator", desc: "Chronological maps divided into learning paths, certifications, and projects.", icon: Award, tab: "roadmap" },
                    { title: "AI Chat Career Mentor", desc: "24/7 mentoring assistance answering resumes, college, and practice interview questions.", icon: MessageSquare, tab: "chatbot" },
                    { title: "Salary Insights & Trends", desc: "Expectation metrics, global benchmarks, and growth forecasts up to 2035.", icon: TrendingUp, tab: "predictor" },
                    { title: "Learning Resources", desc: "Direct directory access to playlists, courses, CS50, and Kaggle environments.", icon: BookOpen, tab: "learning" }
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (!user) {
                          setAuthModalOpen(true);
                        } else {
                          setActiveTab(feat.tab);
                        }
                      }}
                      className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col gap-4 text-left cursor-pointer hover:border-purple-500/30 hover:bg-white/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:text-white transition-all">
                        <feat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1 flex items-center gap-1">
                          {feat.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* 2. AUTHENTICATED DASHBOARD / WORKSPACE VIEWS */}
          {user && activeTab !== "landing" && activeTab !== "learning" && activeTab !== "blog" && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col lg:flex-row gap-8"
            >
              {/* Sidebar Navigation */}
              <aside className="w-full lg:w-64 flex flex-col gap-2">
                {[
                  { id: "dashboard", label: "Dashboard Overview", icon: BarChart3 },
                  { id: "predictor", label: "Career Predictor", icon: Compass },
                  { id: "resume", label: "Resume Analyzer", icon: UploadCloud },
                  { id: "roadmap", label: "Roadmap Generator", icon: Award },
                  { id: "chatbot", label: "AI Chat Mentor", icon: MessageSquare }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === "predictor" && predictedCareers.length === 0) {
                        setQuizStarted(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === item.id
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </aside>

              {/* View Panels */}
              <section className="flex-1 flex flex-col">
                {/* A. DASHBOARD VIEW */}
                {activeTab === "dashboard" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Welcome banner */}
                    <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 text-left">
                        <img src={user.avatar} className="w-16 h-16 rounded-full border border-purple-500/30 object-cover" />
                        <div>
                          <h3 className="text-xl font-bold">Welcome back, {user.name}!</h3>
                          <p className="text-sm text-slate-400">Continue building your roadmap and searching careers.</p>
                        </div>
                      </div>
                      {/* Streak badge */}
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                        <Flame className="w-5 h-5 fill-current" />
                        <div className="text-left">
                          <div className="text-xs text-slate-400 font-medium leading-none">Learning Streak</div>
                          <span className="font-bold text-lg leading-none">{user.streak} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between h-36">
                        <span className="text-sm text-slate-400 font-semibold">Assessment Status</span>
                        <div className="flex items-baseline gap-2 mt-4">
                          <span className="text-3xl font-extrabold">{user.assessmentHistory.length}</span>
                          <span className="text-xs text-slate-500">completed runs</span>
                        </div>
                      </div>
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between h-36">
                        <span className="text-sm text-slate-400 font-semibold">Saved Roadmaps</span>
                        <div className="flex items-baseline gap-2 mt-4">
                          <span className="text-3xl font-extrabold">{user.savedCareers.length}</span>
                          <span className="text-xs text-slate-500">careers saved</span>
                        </div>
                      </div>
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between h-36">
                        <span className="text-sm text-slate-400 font-semibold">Learning Progress</span>
                        <div className="mt-4 flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Step {user.completedSteps} of {user.totalSteps}</span>
                            <span>{Math.round((user.completedSteps / user.totalSteps) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                              style={{ width: `${(user.completedSteps / user.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="glass-panel border-white/5 p-6 rounded-2xl text-left">
                      <h4 className="text-lg font-bold mb-6">Aptitude Score History</h4>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { name: "Week 1", Tech: 40, Analytics: 30, Business: 50 },
                              { name: "Week 2", Tech: 55, Analytics: 45, Business: 55 },
                              { name: "Week 3", Tech: 70, Analytics: 65, Business: 60 },
                              { name: "Week 4", Tech: 85, Analytics: 80, Business: 65 }
                            ]}
                          >
                            <defs>
                              <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                            <YAxis stroke="#475569" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#0b051e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }} />
                            <Area type="monotone" dataKey="Tech" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTech)" />
                            <Area type="monotone" dataKey="Analytics" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAnalytics)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* B. CAREER PREDICTOR VIEW */}
                {activeTab === "predictor" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {!quizStarted && predictedCareers.length === 0 && !predictionsLoading && (
                      <div className="glass-panel border-white/5 p-12 rounded-3xl text-center flex flex-col items-center gap-6 max-w-xl mx-auto mt-8">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <Compass className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">Interactive Career Assessment</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            Take our structured 9-question assessment measuring technical aptitude, design sensibilities, work styles, and goals to predict your optimal roles.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setQuizStarted(true);
                            setQuizStep(0);
                          }}
                          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition-colors active:scale-95 cursor-pointer"
                        >
                          Start Assessment
                        </button>
                      </div>
                    )}

                    {/* Quiz Questionnaire panel */}
                    {quizStarted && (
                      <div className="glass-panel border-white/5 p-8 rounded-3xl text-left max-w-2xl mx-auto w-full mt-4">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-6">
                          <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                          <span>{Math.round(((quizStep) / quizQuestions.length) * 100)}% Complete</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 transition-all duration-300"
                            style={{ width: `${((quizStep) / quizQuestions.length) * 100}%` }}
                          ></div>
                        </div>

                        <h4 className="text-xl font-bold mb-8">{quizQuestions[quizStep].q}</h4>

                        {/* Rendering Scale inputs */}
                        {quizQuestions[quizStep].type === "scale" && (
                          <div className="flex flex-col gap-6">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                              <span>Strongly Dislike 🙅‍♂️</span>
                              <span>Strongly Agree 😍</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              {[2, 4, 6, 8, 10].map((score) => (
                                <button
                                  key={score}
                                  onClick={() => handleQuizAnswer(score)}
                                  className="py-4 rounded-xl border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 text-lg font-bold transition-all active:scale-95"
                                >
                                  {score / 2}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rendering Select options */}
                        {quizQuestions[quizStep].type === "select" && (
                          <div className="flex flex-col gap-3">
                            {quizQuestions[quizStep].options?.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleQuizAnswer(opt)}
                                className="w-full py-4 px-6 text-left rounded-xl border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 text-sm font-semibold transition-all"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Rendering text inputs */}
                        {quizQuestions[quizStep].type === "text" && (
                          <div className="flex flex-col gap-4">
                            <input
                              type="text"
                              id="quiz-text-input"
                              placeholder={quizQuestions[quizStep].placeholder}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-slate-100 outline-none focus:border-purple-500 transition-all text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val.trim()) {
                                    handleQuizAnswer(val);
                                    (e.target as HTMLInputElement).value = "";
                                  }
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const el = document.getElementById("quiz-text-input") as HTMLInputElement;
                                if (el?.value.trim()) {
                                  handleQuizAnswer(el.value);
                                  el.value = "";
                                }
                              }}
                              className="self-end px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold transition-colors"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Skeletons Loader */}
                    {predictionsLoading && (
                      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full mt-4">
                        <p className="text-center text-sm text-purple-400 animate-pulse">Consulting Gemini Career Advisor...</p>
                        {[1, 2, 3].map((s) => (
                          <div key={s} className="glass-panel border-white/5 p-6 rounded-2xl h-28 animate-pulse flex flex-col justify-between">
                            <div className="h-6 w-1/3 bg-white/10 rounded-md"></div>
                            <div className="h-4 w-2/3 bg-white/5 rounded-md"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* predicted list output */}
                    {!predictionsLoading && predictedCareers.length > 0 && (
                      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-2xl font-bold">Top Match Predictions</h3>
                          <button
                            onClick={() => {
                              setQuizStarted(true);
                              setQuizStep(0);
                            }}
                            className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Retake Quiz
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {predictedCareers.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedCareer(item)}
                              className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer hover:border-purple-500/30 hover:bg-white/5 transition-all text-left"
                            >
                              <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-lg font-bold text-slate-100">{item.role}</h4>
                                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/25">
                                    {item.compatibility}% Match
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.matchReason}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {item.skills?.map((s: string, sIdx: number) => (
                                    <span key={sIdx} className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex md:flex-col items-end gap-3 justify-between w-full md:w-auto border-t md:border-none border-white/5 pt-4 md:pt-0">
                                <div className="text-right">
                                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Salary Avg</div>
                                  <span className="font-bold text-slate-200">{item.salary}</span>
                                </div>
                                <button className="px-4 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600 text-purple-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-purple-500/20">
                                  View Details <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* C. RESUME ANALYZER VIEW */}
                {activeTab === "resume" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {!resumeAnalysisResult && !resumeAnalyzing && (
                      <div className="glass-panel border-white/5 p-12 rounded-3xl text-center flex flex-col items-center gap-6 max-w-xl mx-auto mt-8">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">ATS Resume Reviewer</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            Upload your PDF resume to evaluate layout issues, strengths, missing keywords, and get an ATS compatibility score.
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            type="file"
                            id="resume-file-picker"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="resume-file-picker"
                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                          >
                            Upload Resume (PDF)
                          </label>
                        </div>
                      </div>
                    )}

                    {resumeAnalyzing && (
                      <div className="flex flex-col items-center gap-4 max-w-md mx-auto py-16">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-sm text-purple-300">ATS AI engine is parsing your resume format and computing credentials...</p>
                      </div>
                    )}

                    {resumeAnalysisResult && (
                      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full text-left">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-2xl font-bold">ATS Review Result</h3>
                          <button
                            onClick={() => {
                              setResumeAnalysisResult(null);
                              setResumeFile(null);
                            }}
                            className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Upload Different Resume
                          </button>
                        </div>

                        {/* Top Summary Card */}
                        <div className="glass-panel border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            {/* Score Circle */}
                            <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 flex items-center justify-center relative bg-purple-500/5">
                              <span className="text-3xl font-extrabold">{resumeAnalysisResult.atsScore}</span>
                              <span className="absolute bottom-2 text-[10px] text-slate-500 font-bold uppercase">ATS</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold">Analysis Complete</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Uploaded file: {resumeFile?.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`w-2 h-2 rounded-full ${resumeAnalysisResult.atsScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-xs text-slate-400 font-semibold">
                                  {resumeAnalysisResult.atsScore >= 70 ? "Excellent Structure" : "Needs Revision"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={downloadImprovedResume}
                            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Download Improved Resume
                          </button>
                        </div>

                        {/* Strengths & Weaknesses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-panel border-white/5 p-6 rounded-2xl">
                            <h4 className="text-md font-bold mb-4 text-green-400 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> Strengths
                            </h4>
                            <ul className="flex flex-col gap-2.5">
                              {resumeAnalysisResult.strengths?.map((str: string, sIdx: number) => (
                                <li key={sIdx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span> {str}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="glass-panel border-white/5 p-6 rounded-2xl">
                            <h4 className="text-md font-bold mb-4 text-yellow-400 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" /> Area of Improvements
                            </h4>
                            <ul className="flex flex-col gap-2.5">
                              {resumeAnalysisResult.weaknesses?.map((weak: string, wIdx: number) => (
                                <li key={wIdx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                                  <span className="text-yellow-500 mt-1">•</span> {weak}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Keyword suggestions */}
                        <div className="glass-panel border-white/5 p-6 rounded-2xl">
                          <h4 className="text-md font-bold mb-4">Recommended Keywords to Inject</h4>
                          <div className="flex flex-wrap gap-2.5">
                            {resumeAnalysisResult.keywords?.map((keyw: string, kIdx: number) => (
                              <span key={kIdx} className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
                                + {keyw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* D. ROADMAP GENERATOR VIEW */}
                {activeTab === "roadmap" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {!customRoadmap && !roadmapLoading && (
                      <div className="glass-panel border-white/5 p-8 rounded-3xl text-left max-w-xl mx-auto w-full mt-4 flex flex-col gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1">Visual Roadmap Generator</h3>
                          <p className="text-xs text-slate-400">Generate structured phase-by-step milestones to acquire core competencies.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-semibold">Target Career Role</label>
                            <input
                              type="text"
                              placeholder="e.g. AI Product Manager, React Developer..."
                              value={roadmapCareer}
                              onChange={(e) => setRoadmapCareer(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-semibold">Your Current Skill Level</label>
                            <select
                              value={roadmapLevel}
                              onChange={(e) => setRoadmapLevel(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all text-sm text-slate-300"
                            >
                              <option className="bg-[#0b051e]" value="Beginner">Beginner (No experience)</option>
                              <option className="bg-[#0b051e]" value="Intermediate">Intermediate (Basic syntax/concepts)</option>
                              <option className="bg-[#0b051e]" value="Advanced">Advanced (Built projects/worked)</option>
                            </select>
                          </div>

                          <button
                            onClick={generateCustomRoadmap}
                            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition-colors mt-2 cursor-pointer"
                          >
                            Generate Custom Roadmap
                          </button>
                        </div>
                      </div>
                    )}

                    {roadmapLoading && (
                      <div className="flex flex-col items-center gap-4 py-20">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-sm text-purple-300 animate-pulse">Compiling phases, courses, and project specifications from Gemini...</p>
                      </div>
                    )}

                    {customRoadmap && (
                      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full text-left">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-2xl font-bold">
                            Roadmap: <span className="text-purple-400">{customRoadmap.careerName}</span>
                          </h3>
                          <button
                            onClick={() => {
                              setCustomRoadmap(null);
                              setRoadmapCareer("");
                            }}
                            className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Create New Roadmap
                          </button>
                        </div>

                        {/* Interactive Timeline steps */}
                        <div className="flex flex-col gap-6">
                          {customRoadmap.roadmap?.map((phase: any, pIdx: number) => (
                            <div key={pIdx} className="glass-panel border-white/5 p-6 rounded-2xl relative">
                              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                                <div>
                                  <span className="text-xs text-pink-400 font-bold uppercase tracking-wider">{phase.step}</span>
                                  <h4 className="text-lg font-bold mt-0.5 text-slate-100">{phase.title}</h4>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                                  🕒 {phase.estimatedTime}
                                </span>
                              </div>

                              <p className="text-sm text-slate-400 leading-relaxed mb-6">{phase.description}</p>

                              {/* Details sub-grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {phase.courses?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">Recommended Courses</span>
                                    <ul className="flex flex-col gap-1.5">
                                      {phase.courses.map((c: string, cIdx: number) => (
                                        <li key={cIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                          <span className="text-purple-500">•</span> {c}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {phase.projects?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">Hands-on Projects</span>
                                    <ul className="flex flex-col gap-1.5">
                                      {phase.projects.map((p: string, pIdx: number) => (
                                        <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                          <span className="text-purple-500">•</span> {p}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* E. AI CHATBOT VIEW */}
                {activeTab === "chatbot" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col glass-panel border-white/5 rounded-3xl h-[600px] overflow-hidden"
                  >
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="text-left">
                          <h4 className="font-bold text-sm leading-none">CareerAI Mentor</h4>
                          <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Online assistant (Gemini)</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col max-w-[80%] ${
                            msg.role === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed text-left ${
                              msg.role === "user"
                                ? "bg-purple-600 text-white rounded-tr-none"
                                : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-600 mt-1 uppercase font-semibold tracking-wider">
                            {msg.role === "user" ? "You" : "Mentor"}
                          </span>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="self-start flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/5 flex gap-3 bg-white/2">
                      <input
                        type="text"
                        placeholder="Ask about resume tips, roadmap milestones, salaries..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-slate-100 placeholder-slate-500"
                      />
                      <button
                        type="submit"
                        className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* F. ADMIN CONSOLE VIEW */}
                {activeTab === "admin" && user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <ShieldAlert className="w-6 h-6 text-red-400" /> Admin Control Room
                    </h3>
                    
                    {/* Management sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Career Management */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <h4 className="text-md font-bold border-b border-white/5 pb-2">Manage Career Directory</h4>
                        <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                          {adminCareers.map((c, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex justify-between items-center py-1">
                              <span>• {c}</span>
                              <button
                                onClick={() => setAdminCareers(prev => prev.filter(item => item !== c))}
                                className="text-xs text-red-400 font-semibold hover:text-red-300"
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Add career..."
                            value={newCareerInput}
                            onChange={(e) => setNewCareerInput(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-slate-100"
                          />
                          <button
                            onClick={addAdminCareer}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-xl"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Feedback Moderation */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <h4 className="text-md font-bold border-b border-white/5 pb-2">User Feedback</h4>
                        <div className="flex flex-col gap-3 max-h-56 overflow-y-auto">
                          {feedbacks.map((f) => (
                            <div key={f.id} className="text-xs border-b border-white/5 pb-2 last:border-none">
                              <div className="flex justify-between font-semibold text-slate-400">
                                <span>{f.user}</span>
                                <span>{f.email}</span>
                              </div>
                              <p className="text-slate-300 mt-1 italic">"{f.message}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </section>
            </motion.div>
          )}

          {/* 3. LEARNING HUB VIEW */}
          {activeTab === "learning" && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6 max-w-5xl mx-auto w-full text-left"
            >
              <div>
                <h2 className="text-3xl font-bold">Curated Learning Hub</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Access premium online academic resources, open-source directories, and specialized certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {mockLearningResources.map((res) => (
                  <div key={res.id} className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>{res.provider}</span>
                        <span className="text-purple-400">{res.difficulty}</span>
                      </div>
                      <h4 className="text-lg font-bold mt-2 text-slate-100">{res.title}</h4>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-xs text-orange-400 font-semibold">{res.rating}</span>
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        Visit Course
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. BLOG SECTION VIEW */}
          {activeTab === "blog" && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-8 max-w-5xl mx-auto w-full text-left"
            >
              <div>
                <h2 className="text-3xl font-bold">Career & Tech Insights</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Stay updated on industry trends, top undergraduate internships, hackathons, and scholarship guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {mockBlogs.map((blog) => (
                  <div key={blog.id} className="glass-panel border-white/5 rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:border-purple-500/20 transition-all">
                    <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover" />
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-2">
                          <span>{blog.category}</span>
                          <span>{blog.date}</span>
                        </div>
                        <h4 className="text-md font-bold leading-snug group-hover:text-purple-400 transition-colors">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{blog.excerpt}</p>
                      </div>
                      <span className="text-[11px] text-purple-400 font-bold self-start">{blog.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-8 border-t border-white/5 mt-16 text-center flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <span className="text-xs text-slate-500">© 2026 CareerAI Pro Inc. All rights reserved.</span>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <button onClick={() => setActiveTab("landing")} className="hover:text-white transition-colors">About Us</button>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="https://github.com/senguptakrishnendu103-dotcom/ai-career-counsellor" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>

      {/* ================= MODAL OVERLAYS ================= */}

      {/* A. Auth Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setAuthModalOpen(false)}
            />
            {/* dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm glass-panel border-white/10 p-8 rounded-3xl text-left"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-bold mb-1">
                {authMode === "login" ? "Welcome Back" : authMode === "signup" ? "Get Started" : "Reset Password"}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {authMode === "login" ? "Enter credentials to unlock assessment tools" : "Sign up for a premium career dashboard"}
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {authMode === "signup" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-semibold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-100"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="hint: 'admin@career.com' for admin dashboard"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-400 font-semibold">Password</label>
                    {authMode === "login" && (
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-[10px] text-purple-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition-colors mt-2 cursor-pointer"
                >
                  {authMode === "login" ? "Sign In" : "Register Account"}
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 mt-6">
                {authMode === "login" ? (
                  <span>
                    New to CareerAI?{" "}
                    <button onClick={() => setAuthMode("signup")} className="text-purple-400 hover:underline">
                      Create Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button onClick={() => setAuthMode("login")} className="text-purple-400 hover:underline">
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Demo Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDemoModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl glass-panel border-white/10 p-6 rounded-3xl overflow-hidden aspect-video flex flex-col justify-between"
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center bg-purple-900/10">
                <Play className="w-16 h-16 text-purple-500 animate-pulse cursor-pointer" />
              </div>
              <div className="z-10 mt-auto text-left">
                <h4 className="text-lg font-bold">CareerAI Pro Platform Walkthrough</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Learn how our interactive questionnaire and resume ATS parser helps thousands of engineering students find and target optimal career opportunities.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Career Details Drawer / Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedCareer(null)}
            />
            {/* Drawer layout */}
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full glass-panel border-l border-white/10 p-8 rounded-l-3xl overflow-y-auto text-left flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Career Details Overview</span>
                  <h3 className="text-2xl font-bold text-slate-100">{selectedCareer.role}</h3>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Demand and salary specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expected Global Salary</span>
                  <span className="font-bold text-slate-200">{selectedCareer.salary}</span>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Demand till 2035</span>
                  <span className="font-bold text-slate-200">{selectedCareer.demand}</span>
                </div>
              </div>

              {/* Match Reason detail */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aptitude Match Reason</span>
                <p className="text-sm text-slate-300 leading-relaxed bg-purple-500/5 border border-purple-500/10 p-4 rounded-xl">
                  {selectedCareer.matchReason}
                </p>
              </div>

              {/* Required Core Skills */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Required Competencies</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.skills?.map((s: string, idx: number) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hiring companies */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top Hiring Companies</span>
                <div className="flex flex-wrap gap-3">
                  {selectedCareer.companies?.map((c: string, idx: number) => (
                    <span key={idx} className="text-xs font-bold text-slate-400">
                      {c} {idx < selectedCareer.companies.length - 1 ? "•" : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projected Growth graph */}
              {selectedCareer.growthGraph && (
                <div className="flex flex-col gap-4">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projected Demand Growth</span>
                  <div className="w-full h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { year: "2026", demand: selectedCareer.growthGraph[0] },
                          { year: "2029", demand: selectedCareer.growthGraph[1] },
                          { year: "2032", demand: selectedCareer.growthGraph[2] },
                          { year: "2035", demand: selectedCareer.growthGraph[3] }
                        ]}
                      >
                        <XAxis dataKey="year" stroke="#475569" fontSize={10} />
                        <YAxis stroke="#475569" fontSize={10} />
                        <Tooltip />
                        <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#ec4899", r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Roadmap Timeline overview */}
              {selectedCareer.roadmap && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Timeline Learning Path</span>
                  <div className="next-timeline pl-5 ml-2 text-left flex flex-col gap-6">
                    {selectedCareer.roadmap.map((step: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-purple-600 next-timeline-node"></div>
                        <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Step {idx + 1}</span>
                        <h5 className="font-bold text-sm text-slate-200 mt-0.5">{step.title}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
