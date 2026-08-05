"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
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
  GraduationCap,
  Bell,
  Globe,
  Mic,
  Plus,
  Square,
  CheckSquare,
  Video,
  VideoOff,
  ArrowLeft,
  Trash2,
  Activity,
  Command
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
  goals: string[];
  skills: string[];
  weakAreas: string[];
  certifications: string[];
  readinessScore: number;
  confidenceScore: number;
  weeklyProgress: number[];
  placementReady: boolean;
  trackerJobs: { company: string; role: string; status: string; date: string }[];
  studyHours: number;
  consistencyScore: number;
  completionPercentage: number;
  missions: { id: number; task: string; completed: boolean }[];
  interviewHistory: { role: string; type: string; date: string; score: number; feedback: string }[];
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
  const [user, setUser] = useState<UserProfile | null>(null);

  // Helper: build a fresh UserProfile from a Supabase User object + optional profile row
  const buildUserProfile = (sbUser: any, profileRow?: any): UserProfile => {
    const meta = sbUser.user_metadata || {};
    if (profileRow) {
      // If a profiles-table row exists, use it (spread keeps all persisted fields)
      return {
        name: profileRow.name || meta.name || sbUser.email?.split("@")[0] || "User",
        email: profileRow.email || sbUser.email || "",
        avatar: profileRow.avatar || meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${meta.name || sbUser.email}`,
        streak: profileRow.streak ?? 0,
        role: profileRow.role || (sbUser.email?.includes("admin") ? "admin" : "user"),
        savedCareers: profileRow.savedCareers ?? [],
        assessmentHistory: profileRow.assessmentHistory ?? [],
        completedSteps: profileRow.completedSteps ?? 0,
        totalSteps: profileRow.totalSteps ?? 15,
        goals: profileRow.goals ?? [],
        skills: profileRow.skills ?? [],
        weakAreas: profileRow.weakAreas ?? [],
        certifications: profileRow.certifications ?? [],
        readinessScore: profileRow.readinessScore ?? 50,
        confidenceScore: profileRow.confidenceScore ?? 50,
        weeklyProgress: profileRow.weeklyProgress ?? [0, 0, 0, 0, 0, 0, 0],
        placementReady: profileRow.placementReady ?? false,
        trackerJobs: profileRow.trackerJobs ?? [],
        studyHours: profileRow.studyHours ?? 0,
        consistencyScore: profileRow.consistencyScore ?? 0,
        completionPercentage: profileRow.completionPercentage ?? 0,
        missions: profileRow.missions ?? [
          { id: 1, task: "Complete your first career assessment", completed: false },
          { id: 2, task: "Upload and analyze your resume", completed: false },
          { id: 3, task: "Practice an AI interview session", completed: false }
        ],
        interviewHistory: profileRow.interviewHistory ?? []
      };
    }
    // No profile row — build defaults from auth metadata
    return {
      name: meta.name || sbUser.email?.split("@")[0] || "User",
      email: sbUser.email || "",
      avatar: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${meta.name || sbUser.email}`,
      streak: 0,
      role: sbUser.email?.includes("admin") ? "admin" : "user",
      savedCareers: [],
      assessmentHistory: [],
      completedSteps: 0,
      totalSteps: 15,
      goals: [],
      skills: [],
      weakAreas: [],
      certifications: [],
      readinessScore: 50,
      confidenceScore: 50,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      placementReady: false,
      trackerJobs: [],
      studyHours: 0,
      consistencyScore: 0,
      completionPercentage: 0,
      missions: [
        { id: 1, task: "Complete your first career assessment", completed: false },
        { id: 2, task: "Upload and analyze your resume", completed: false },
        { id: 3, task: "Practice an AI interview session", completed: false }
      ],
      interviewHistory: []
    };
  };

  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === "forgot") {
      if (!authForm.email) {
        alert("Please enter your email address.");
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(authForm.email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`
      });
      if (error) {
        alert("Password reset error: " + error.message);
        return;
      }
      alert("Password reset link sent! Please check your email inbox.");
      setAuthMode("login");
      return;
    }

    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            name: authForm.name || "User"
          }
        }
      });
      if (error) {
        const msg = error.message?.includes("Failed to fetch")
          ? "Failed to fetch: Unable to connect to Supabase. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are added to your Render Environment Variables."
          : error.message;
        alert("Sign up error: " + msg);
        return;
      }
      alert("Registration successful! Check your email for a verification link, then log in.");
      setAuthMode("login");
      return;
    }

    // Login flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password
    });
    if (error) {
      const msg = error.message?.includes("Failed to fetch")
        ? "Failed to fetch: Unable to connect to Supabase. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are added to your Render Environment Variables."
        : error.message;
      alert("Sign in error: " + msg);
      return;
    }

    // Build user profile from the authenticated session
    if (data.user) {
      // Try to fetch profile row from Supabase (will fail silently if table doesn't exist yet)
      let profileRow: any = null;
      try {
        const { data: row } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        profileRow = row;
      } catch (_) { /* profiles table may not exist yet */ }

      const profile = buildUserProfile(data.user, profileRow);
      setUser(profile);
      localStorage.setItem("careerverse_user", JSON.stringify(profile));
    }

    setAuthForm({ name: "", email: "", password: "" });
    setAuthModalOpen(false);
    setActiveTab("dashboard");
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("careerverse_user");
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
      content: "Hello! I am your CareerVerse Mentor. Ask me any career, college, resume or preparation questions, and let's structure your future today!"
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

  // ================= NEW CAREER OS STATE & WIDGETS =================
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Google Generation Scholarship application is live!", date: "Today", read: false },
    { id: 2, text: "Vercel is hiring remote Frontend Interns. Apply now!", date: "1 day ago", read: false },
    { id: 3, text: "Hackathon: Smart India Hackathon 2026 starts in 10 days.", date: "3 days ago", read: true }
  ]);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotMessages, setCopilotMessages] = useState([
    { role: "model", content: "Hi Akash! I am your CareerVerse Copilot. Ask me anything, and I will recommend actions based on your current readiness score (78%)!" }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const copilotEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    copilotEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [copilotMessages]);

  // Toggle mission status and dynamically adjust confidence & progress score
  const handleToggleMission = (missionId: number) => {
    if (!user) return;
    const updatedMissions = user.missions.map(m => {
      if (m.id === missionId) return { ...m, completed: !m.completed };
      return m;
    });
    const completedCount = updatedMissions.filter(m => m.completed).length;
    const completionPercentage = Math.round((completedCount / updatedMissions.length) * 100);
    const newConfidence = Math.min(100, 70 + completedCount * 10);
    
    // Add to weekly progress
    const newProgress = [...user.weeklyProgress];
    newProgress[newProgress.length - 1] = Math.min(100, newProgress[newProgress.length - 1] + 5);

    setUser({
      ...user,
      missions: updatedMissions,
      completionPercentage,
      confidenceScore: newConfidence,
      weeklyProgress: newProgress
    });
  };

  // Add Job Tracking application
  const [newJobForm, setNewJobForm] = useState({ company: "", role: "", status: "Applied" });
  const handleAddJobTracker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newJobForm.company || !newJobForm.role) return;
    const newJobs = [
      ...user.trackerJobs,
      {
        company: newJobForm.company,
        role: newJobForm.role,
        status: newJobForm.status,
        date: new Date().toISOString().split('T')[0]
      }
    ];
    // Increase readiness score dynamically
    const newReadiness = Math.min(100, user.readinessScore + 3);
    setUser({
      ...user,
      trackerJobs: newJobs,
      readinessScore: newReadiness
    });
    setNewJobForm({ company: "", role: "", status: "Applied" });
  };

  // Study Planner Missed Tasks Adaptiveness
  const [studyMissions, setStudyMissions] = useState([
    { day: "Monday", task: "Next.js routing patterns (2 hrs)", completed: true },
    { day: "Tuesday", task: "Solve 2 Leetcode Tree questions (1.5 hrs)", completed: true },
    { day: "Wednesday", task: "Upload resume to ATS reviewer (1 hr)", completed: false },
    { day: "Thursday", task: "AWS Certified Practitioner mock exam (2.5 hrs)", completed: false },
    { day: "Friday", task: "Design System Portfolio wireframes (2 hrs)", completed: false },
    { day: "Saturday", task: "Gemini API integration coding (3 hrs)", completed: false },
    { day: "Sunday", task: "Mock Behavioral Interview practice (1.5 hrs)", completed: false }
  ]);
  const [adaptiveMessage, setAdaptiveMessage] = useState("");

  const handleAdaptiveReschedule = () => {
    // Collect incomplete tasks and shift them/distribute
    const updated = studyMissions.map((m) => {
      // If wednesday (yesterday) was incomplete, push it to Saturday, etc.
      if (m.day === "Wednesday" && !m.completed) {
        return { ...m, task: m.task + " (Rescheduled)", day: "Saturday" };
      }
      return m;
    });
    setStudyMissions(updated);
    setAdaptiveMessage("Daily schedule adjusted! Missed tasks have been moved and distributed to the weekend.");
    setTimeout(() => setAdaptiveMessage(""), 5000);
  };

  // AI Portfolio Builder state
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    theme: "Dark Neon",
    name: "Akash Sengupta",
    title: "AI & Fullstack Engineer",
    bio: "Building production-grade web systems powered by Gemini 2.5 and Next.js.",
    skills: "React, Next.js, TypeScript, Node.js, Python, Tailwind, REST APIs",
    projects: "AI Resume ATS, blockchain-voting, CareerVerse, Real-time Chat",
    github: "github.com/senguptakrishnendu103-dotcom",
    linkedin: "linkedin.com/in/akash-sengupta"
  });

  // AI Interview Lab track states
  const [interviewTrack, setInterviewTrack] = useState<"Behavioral" | "Coding" | "HR" | "System Design">("Behavioral");
  const [interviewStep, setInterviewStep] = useState<"setup" | "simulating" | "feedback">("setup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInterviewAnswer, setUserInterviewAnswer] = useState("");
  const [simulatedVideoState, setSimulatedVideoState] = useState(false);
  
  const interviewQuestions = {
    Behavioral: [
      "Tell me about a time you resolved a major bug in a production environment under pressure.",
      "How do you handle disagreement with a technical lead or product owner?",
      "Describe a project you worked on where you had to learn a completely new technology quickly."
    ],
    Coding: [
      "Write a function to detect if a linked list contains a cycle. What is the time complexity?",
      "Implement a function that finds the longest palindromic substring in a string.",
      "Explain the difference between CSR, SSR, and ISR in Next.js, and when to use each."
    ],
    HR: [
      "Why do you want to join our organization as an AI Software Engineer?",
      "Where do you see yourself in 5 years? What skills do you want to master?",
      "What are your salary expectations, and how do you define success in your role?"
    ],
    "System Design": [
      "How would you design a scalable real-time notification system like Slack?",
      "Explain how you would handle distributed rate limiting in a microservices ecosystem.",
      "Design a system to support high-throughput file uploads (e.g. large PDF resumes) with parsing."
    ]
  };

  const [aiInterviewFeedback, setAiInterviewFeedback] = useState({
    confidenceScore: 85,
    eyeContactRating: "Excellent (92% direct focus)",
    commAnalysis: "Clear articulation, moderate pacing. Filler words used: 'like' (1x), 'um' (2x). Good logical structure using STAR framework.",
    answerQuality: "Strong. Demonstrates deep understanding of development cycles, team communication, and automated testing.",
    improvementTips: "Try to specify the exact metrics of your impact (e.g., 'reduced render times by 35%') to strengthen your STAR outcomes."
  });

  const handleSendInterviewAnswer = () => {
    if (!userInterviewAnswer.trim()) return;
    
    if (currentQuestionIndex < interviewQuestions[interviewTrack].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserInterviewAnswer("");
    } else {
      setInterviewStep("feedback");
      // Add to user interview history
      if (user) {
        setUser({
          ...user,
          interviewHistory: [
            ...user.interviewHistory,
            {
              role: `${interviewTrack} Sim`,
              type: interviewTrack,
              date: new Date().toISOString().split('T')[0],
              score: 85,
              feedback: "Articulation is clear. STAR structure followed successfully. Tips: add quantitative metrics."
            }
          ]
        });
      }
    }
  };

  // Keyboard Shortcuts for Command Palette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load user session from Supabase or localStorage fallback on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Try to load profile row; fall back to auth metadata
          let profileRow: any = null;
          try {
            const { data: row } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
            profileRow = row;
          } catch (_) { /* profiles table may not exist yet */ }

          const profile = buildUserProfile(session.user, profileRow);
          setUser(profile);
          setActiveTab("dashboard");
        } else {
          // No active Supabase session — try localStorage
          const savedUser = localStorage.getItem("careerverse_user");
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
              setActiveTab("dashboard");
            } catch (_) { /* corrupt data */ }
          }
        }

        // Listen for future auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            let profileRow: any = null;
            try {
              const { data: row } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();
              profileRow = row;
            } catch (_) { /* profiles table may not exist */ }

            const profile = buildUserProfile(session.user, profileRow);
            setUser(profile);
            localStorage.setItem("careerverse_user", JSON.stringify(profile));
            setActiveTab("dashboard");
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            localStorage.removeItem("careerverse_user");
            setActiveTab("landing");
          }
        });
        unsubscribe = () => subscription.unsubscribe();
      } catch (err) {
        console.error("Supabase session load error, falling back to localStorage:", err);
        // Final fallback: localStorage
        const savedUser = localStorage.getItem("careerverse_user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setActiveTab("dashboard");
          } catch (_) { /* corrupt data */ }
        }
      }
    };

    checkSession();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // AI Copilot Send Message
  const handleSendCopilotMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!copilotInput.trim()) return;
    
    const userMsg = { role: "user", content: copilotInput };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotInput("");
    setCopilotLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are CareerVerse Copilot. The user has: Goals: ${user?.goals.join(", ")}, Skills: ${user?.skills.join(", ")}, Weak Areas: ${user?.weakAreas.join(", ")}, Certifications: ${user?.certifications.join(", ")}, Readiness Score: ${user?.readinessScore}%. Answer user query: ${userMsg.content}`
            }
          ]
        })
      });
      const data = await response.json();
      if (response.ok) {
        setCopilotMessages(prev => [...prev, { role: "model", content: data.response }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  // AI Copilot Send Suggestion Chip
  const handleSendCopilotSuggestion = async (suggestionText: string) => {
    const userMsg = { role: "user", content: suggestionText };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are CareerVerse Copilot. The user has: Goals: ${user?.goals.join(", ")}, Skills: ${user?.skills.join(", ")}, Weak Areas: ${user?.weakAreas.join(", ")}, Certifications: ${user?.certifications.join(", ")}, Readiness Score: ${user?.readinessScore}%. Answer user query: ${userMsg.content}`
            }
          ]
        })
      });
      const data = await response.json();
      if (response.ok) {
        setCopilotMessages(prev => [...prev, { role: "model", content: data.response }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Community Hub state
  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: "Suresh Kumar", role: "React Dev", text: "Just completed the Next.js 15 routing course! Celebrating this milestone.", likes: 8, comments: 2, date: "2 hrs ago" },
    { id: 2, author: "Priya Das", role: "AI Student", text: "Looking for teammates for the upcoming Vercel Hackathon. Tech stack: Python, Next.js.", likes: 12, comments: 5, date: "5 hrs ago" }
  ]);
  const [newPostText, setNewPostText] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setCommunityPosts([
      {
        id: Date.now(),
        author: user?.name || "Akash Sengupta",
        role: "Member",
        text: newPostText,
        likes: 0,
        comments: 0,
        date: "Just now"
      },
      ...communityPosts
    ]);
    setNewPostText("");
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
            Career<span className="text-purple-400">Verse</span>
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
              {/* Command Palette Indicator */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/3 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold"
                title="Search or Quick Actions"
              >
                <Command className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="bg-white/10 px-1 py-0.5 rounded text-[10px] ml-1">Ctrl+K</kbd>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
                  )}
                </button>
                
                {/* Dropdown menu */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 glass-panel border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-left"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                        <span className="text-xs font-bold text-slate-200">Alert Center</span>
                        <button
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          className="text-[10px] text-purple-400 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              n.read ? 'bg-white/2 border-white/5 text-slate-400' : 'bg-purple-500/5 border-purple-500/10 text-slate-200 font-medium'
                            }`}
                          >
                            <p>{n.text}</p>
                            <span className="text-[10px] text-slate-500 block mt-1">{n.date}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                  { id: "roadmap", label: "Roadmap & Projects", icon: Award },
                  { id: "study-planner", label: "AI Study Planner", icon: Calendar },
                  { id: "portfolio-builder", label: "Portfolio Builder", icon: Sparkles },
                  { id: "interview-lab", label: "AI Interview Lab", icon: Briefcase },
                  { id: "community", label: "Community Hub", icon: Users },
                  { id: "chatbot", label: "AI Career Copilot", icon: MessageSquare }
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
                          <p className="text-sm text-slate-400">Your AI Career Copilot is online. View your Career OS dashboard below.</p>
                        </div>
                      </div>
                      {/* Streak badge */}
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 text-orange-400">
                        <Flame className="w-5 h-5 fill-current" />
                        <div className="text-left">
                          <div className="text-xs text-slate-400 font-medium leading-none">Learning Streak</div>
                          <span className="font-bold text-lg leading-none">{user.streak} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* Career OS Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Readiness Score Gauge */}
                      <div className="glass-panel border-white/5 p-5 rounded-2xl text-left flex flex-col justify-between h-40">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Career Readiness Score</span>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative bg-purple-500/5">
                            <span className="text-lg font-black">{user.readinessScore}%</span>
                          </div>
                          <div>
                            <span className="text-xs text-green-400 font-semibold flex items-center gap-0.5">▲ 4% this week</span>
                            <p className="text-[10px] text-slate-500">Top 15% in SaaS Roles</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Confidence Meter */}
                      <div className="glass-panel border-white/5 p-5 rounded-2xl text-left flex flex-col justify-between h-40">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI Confidence Score</span>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="w-16 h-16 rounded-full border-4 border-pink-500/30 flex items-center justify-center relative bg-pink-500/5">
                            <span className="text-lg font-black">{user.confidenceScore}%</span>
                          </div>
                          <div>
                            <span className="text-xs text-pink-400 font-semibold">Adaptive Learning</span>
                            <p className="text-[10px] text-slate-500">Stability: High</p>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Progress Widget */}
                      <div className="glass-panel border-white/5 p-5 rounded-2xl text-left flex flex-col justify-between h-40">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Progress</span>
                        <div className="mt-2 flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Missions</span>
                            <span>{user.completionPercentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                              style={{ width: `${user.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-500">Consistency Index: 88%</span>
                        </div>
                      </div>

                      {/* Placement Readiness */}
                      <div className="glass-panel border-white/5 p-5 rounded-2xl text-left flex flex-col justify-between h-40">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Placement Readiness</span>
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Ready
                          </span>
                          <p className="text-[10px] text-slate-500 mt-2">3 applications active</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill Galaxy & Daily Missions row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Skill Galaxy SVG Visualization */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <div>
                          <h4 className="text-md font-bold mb-1">Interactive Skill Galaxy</h4>
                          <p className="text-xs text-slate-400 mb-6">Click a system orbit node to expand learning paths.</p>
                        </div>
                        <div className="relative w-full h-64 bg-slate-950/20 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                          {/* Centered Node */}
                          <div className="absolute w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center z-10 shadow-lg shadow-purple-500/20 animate-pulse">
                            <Sparkles className="w-4 h-4 text-purple-300" />
                          </div>

                          {/* Orbits */}
                          <div className="absolute w-24 h-24 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]">
                            <div className="absolute -top-1.5 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-pink-500 cursor-pointer" title="React/Next.js node" />
                          </div>
                          <div className="absolute w-44 h-44 border border-white/5 rounded-full animate-[spin_20s_linear_infinite_reverse]">
                            <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-blue-500 cursor-pointer" title="TypeScript node" />
                            <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" title="Python node" />
                          </div>
                          <div className="absolute w-60 h-60 border border-white/5 rounded-full animate-[spin_35s_linear_infinite]">
                            <div className="absolute top-1/2 left-0 -mt-2 w-4 h-4 rounded-full bg-red-400 cursor-pointer" title="System Design node" />
                            <div className="absolute top-1/2 right-0 -mt-2 w-3.5 h-3.5 rounded-full bg-green-400 cursor-pointer" title="Data Structures node" />
                          </div>
                          
                          <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-semibold">
                            🪐 Interactive Skill Galaxy
                          </div>
                        </div>
                      </div>

                      {/* Daily Missions */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <div>
                          <h4 className="text-md font-bold mb-1">AI Daily Missions</h4>
                          <p className="text-xs text-slate-400 mb-6">Complete tasks to boost consistency and readiness score.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                          {user.missions.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => handleToggleMission(m.id)}
                              className="w-full p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex items-center justify-between text-left"
                            >
                              <div className="flex items-center gap-3">
                                {m.completed ? (
                                  <CheckSquare className="w-5 h-5 text-purple-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-slate-500" />
                                )}
                                <span className={`text-sm ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                  {m.task}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                                {m.completed ? "+10 XP" : "Pending"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Salary growth & heatmap row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Salary Growth Projection */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left lg:col-span-2">
                        <h4 className="text-md font-bold mb-1">Salary Growth Projection (2026 - 2035)</h4>
                        <p className="text-xs text-slate-400 mb-6">Gemini model expectations based on current career specialization.</p>
                        <div className="w-full h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { name: "2026", CurrentPath: 65000, AIDirected: 72000 },
                                { name: "2028", CurrentPath: 78000, AIDirected: 95000 },
                                { name: "2030", CurrentPath: 92000, AIDirected: 130000 },
                                { name: "2032", CurrentPath: 110000, AIDirected: 175000 },
                                { name: "2035", CurrentPath: 135000, AIDirected: 240000 }
                              ]}
                            >
                              <defs>
                                <linearGradient id="colorPath" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                              <YAxis stroke="#475569" fontSize={11} tickFormatter={(val: number) => `$${val/1000}k`} />
                              <Tooltip contentStyle={{ backgroundColor: "#0b051e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }} />
                              <Area type="monotone" name="Standard Growth" dataKey="CurrentPath" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPath)" />
                              <Area type="monotone" name="CareerVerse Guided" dataKey="AIDirected" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Industry Demand Heatmap */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left">
                        <h4 className="text-md font-bold mb-1">Industry Demand Index</h4>
                        <p className="text-xs text-slate-400 mb-6">Real-time hiring frequency indexes across sectors.</p>
                        <div className="grid grid-cols-7 gap-2">
                          {/* We will draw a nice contribution matrix of hiring heat map */}
                          {Array.from({ length: 28 }).map((_, i) => {
                            const weights = [1, 2, 4, 3, 2, 4, 3, 1, 2, 3, 4, 4, 2, 1, 2, 3, 4, 3, 2, 1, 4, 3, 4, 4, 3, 2, 1, 4];
                            const weight = weights[i % weights.length];
                            const colors = ["bg-white/5", "bg-purple-950/40", "bg-purple-800/40", "bg-purple-600/50", "bg-pink-500/70"];
                            return (
                              <div
                                key={i}
                                className={`w-full aspect-square rounded ${colors[weight]} transition-colors hover:scale-110 cursor-pointer`}
                                title={`Activity index: ${weight * 25}%`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 font-semibold">
                          <span>Low Hiring</span>
                          <div className="flex gap-1">
                            <span className="w-2.5 h-2.5 rounded bg-white/5" />
                            <span className="w-2.5 h-2.5 rounded bg-purple-950/40" />
                            <span className="w-2.5 h-2.5 rounded bg-purple-800/40" />
                            <span className="w-2.5 h-2.5 rounded bg-purple-600/50" />
                            <span className="w-2.5 h-2.5 rounded bg-pink-500/70" />
                          </div>
                          <span>High Hiring</span>
                        </div>
                      </div>
                    </div>

                    {/* Today's Recommendation & Internship Tracker Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Learning Recommendation */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <div>
                          <h4 className="text-md font-bold mb-1">Today's Daily Recommendation</h4>
                          <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">Skill Gap Focus</span>
                          <p className="text-sm text-slate-200 mt-4 leading-relaxed font-semibold">
                            "System Design" is marked as your growth area.
                          </p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            We recommend enrolling in the MIT 6.006 Algorithms & Harvard CS50 curriculum.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("learning")}
                          className="w-full mt-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition-colors"
                        >
                          Enrol in Classes
                        </button>
                      </div>

                      {/* Internship Tracker table */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl text-left lg:col-span-2">
                        <h4 className="text-md font-bold mb-1">Internship Application Pipeline</h4>
                        <p className="text-xs text-slate-400 mb-4">Track progress of your applications in one unified pipeline.</p>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-white/5 text-slate-500 font-bold">
                                <th className="pb-2">Company</th>
                                <th className="pb-2">Role</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Applied Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {user.trackerJobs.map((job, idx) => (
                                <tr key={idx} className="border-b border-white/5 last:border-none">
                                  <td className="py-2.5 font-bold text-slate-200">{job.company}</td>
                                  <td className="py-2.5 text-slate-300">{job.role}</td>
                                  <td className="py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      job.status === "Interviewing" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                      job.status === "Applied" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                      "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                      {job.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-slate-400">{job.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Application Form inline */}
                        <form onSubmit={handleAddJobTracker} className="mt-4 flex gap-2">
                          <input
                            type="text"
                            placeholder="Company"
                            value={newJobForm.company}
                            onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            value={newJobForm.role}
                            onChange={(e) => setNewJobForm({ ...newJobForm, role: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            required
                          />
                          <select
                            value={newJobForm.status}
                            onChange={(e) => setNewJobForm({ ...newJobForm, status: e.target.value })}
                            className="bg-[#0b051e] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Log
                          </button>
                        </form>
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
                          <h4 className="font-bold text-sm leading-none">CareerVerse Mentor</h4>
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

                {/* AI STUDY PLANNER VIEW */}
                {activeTab === "study-planner" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold">AI Study Planner</h3>
                        <p className="text-xs text-slate-400">Weekly structured milestones powered by CareerVerse AI engine.</p>
                      </div>
                      <button
                        onClick={handleAdaptiveReschedule}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5" /> Adaptive Reschedule
                      </button>
                    </div>

                    {adaptiveMessage && (
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold animate-pulse">
                        {adaptiveMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-panel border-white/5 p-5 rounded-2xl md:col-span-2 flex flex-col gap-4">
                        <h4 className="text-sm font-bold border-b border-white/5 pb-2">Weekly Schedule</h4>
                        <div className="flex flex-col gap-3">
                          {studyMissions.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/2 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-1">{item.day}</span>
                                <span className="text-xs font-bold text-slate-200">{item.task}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.completed ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                }`}>
                                  {item.completed ? "Completed" : "Pending"}
                                </span>
                                <button
                                  onClick={() => {
                                    const updated = [...studyMissions];
                                    updated[idx].completed = !updated[idx].completed;
                                    setStudyMissions(updated);
                                  }}
                                  className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                  {item.completed ? <CheckSquare className="w-4 h-4 text-purple-400" /> : <Square className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        {/* Motivation widget */}
                        <div className="glass-panel border-white/5 p-5 rounded-2xl">
                          <h4 className="text-sm font-bold mb-2">AI Copilot Tip</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            "Hey Akash, you completed 2 out of 7 tasks this week. Your consistency index is 88%. Solve your Leetcode Tree question tomorrow to hit your 90% Readiness target!"
                          </p>
                        </div>

                        {/* Calendar visual */}
                        <div className="glass-panel border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                          <h4 className="text-sm font-bold border-b border-white/5 pb-2">Calendar Milestones</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>Vercel Interview prep - Aug 4</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-pink-500" />
                            <span>System Design mock - Aug 8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PORTFOLIO BUILDER VIEW */}
                {activeTab === "portfolio-builder" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">AI Portfolio Builder</h3>
                      <p className="text-xs text-slate-400">Generate a hostable, interactive portfolio based on your goals and achievements.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Input Fields */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <h4 className="text-sm font-bold border-b border-white/5 pb-2">Portfolio Information</h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-bold">Theme styling</label>
                            <select
                              value={portfolioData.theme}
                              onChange={(e) => setPortfolioData({ ...portfolioData, theme: e.target.value })}
                              className="bg-[#0b051e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            >
                              <option value="Dark Neon">Dark Neon</option>
                              <option value="Glassmorphism Premium">Glassmorphism Premium</option>
                              <option value="Minimalist Cyberpunk">Minimalist Cyberpunk</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-bold">Profession Title</label>
                            <input
                              type="text"
                              value={portfolioData.title}
                              onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-bold">Short Bio</label>
                            <textarea
                              rows={3}
                              value={portfolioData.bio}
                              onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-bold">Skills List</label>
                            <input
                              type="text"
                              value={portfolioData.skills}
                              onChange={(e) => setPortfolioData({ ...portfolioData, skills: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400 font-bold">Featured Projects</label>
                            <input
                              type="text"
                              value={portfolioData.projects}
                              onChange={(e) => setPortfolioData({ ...portfolioData, projects: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setPortfolioGenerated(true);
                              // Increment readiness score slightly on generating portfolio
                              if (user) {
                                setUser({ ...user, readinessScore: Math.min(100, user.readinessScore + 2) });
                              }
                            }}
                            className="w-full mt-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition-colors text-center text-white cursor-pointer"
                          >
                            Update & Render Portfolio Live
                          </button>
                        </div>
                      </div>

                      {/* Right: Live Preview Container */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold border-b border-white/5 pb-2 mb-4">Interactive Live Preview</h4>
                          <div className={`p-6 rounded-xl border border-purple-500/30 bg-slate-950/40 text-left min-h-[300px] flex flex-col justify-between relative overflow-hidden ${
                            portfolioData.theme === "Dark Neon" ? "shadow-2xl shadow-purple-500/5" : "backdrop-blur-xl"
                          }`}>
                            <div className="absolute top-2 right-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Live on Web</span>
                            </div>
                            
                            <div>
                              <h2 className="text-xl font-extrabold text-white">{portfolioData.name}</h2>
                              <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mt-0.5">{portfolioData.title}</p>
                              <p className="text-xs text-slate-400 leading-relaxed mt-4">{portfolioData.bio}</p>

                              <div className="mt-4">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Skills</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {portfolioData.skills.split(",").map((s, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300 font-medium">
                                      {s.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-4">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Featured Projects</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {portfolioData.projects.split(",").map((p, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-[9px] text-pink-300 font-medium">
                                      {p.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                              <span className="text-[8px] text-slate-500 font-semibold">{portfolioData.github}</span>
                              <span className="text-[8px] text-slate-500 font-semibold">{portfolioData.linkedin}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert("Portfolio layout generated! PDF export downloaded.")}
                          className="w-full mt-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-white"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Portfolio Site Bundle
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* AI INTERVIEW LAB VIEW */}
                {activeTab === "interview-lab" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">AI Interview Lab</h3>
                      <p className="text-xs text-slate-400">Mock simulation with audio/video feedback powered by Gemini models.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left 2 cols: Interview simulation workspace */}
                      <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Simulated webcam feedback box */}
                        <div className="relative w-full h-80 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d0728] to-slate-950 border border-white/5 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                          {/* Live signal indicator */}
                          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                            <span>Simulated Camera & Voice Input: ACTIVE</span>
                          </div>

                          {simulatedVideoState ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 relative">
                              {/* Avatar placeholder that bounces or reacts */}
                              <div className="w-24 h-24 rounded-full border-4 border-pink-500 bg-pink-500/20 flex items-center justify-center animate-pulse">
                                <User className="w-12 h-12 text-pink-300" />
                              </div>
                              <span className="text-xs text-slate-300 font-bold mt-4">Analyzing facial composure and direct focus...</span>
                              <button
                                onClick={() => setSimulatedVideoState(false)}
                                className="absolute bottom-4 right-4 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1"
                              >
                                <VideoOff className="w-3.5 h-3.5" /> Stop Camera
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                                <VideoOff className="w-8 h-8" />
                              </div>
                              <span className="text-xs text-slate-400">Webcam stream is currently disabled.</span>
                              <button
                                onClick={() => setSimulatedVideoState(true)}
                                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold flex items-center gap-1.5 mt-2 text-white cursor-pointer"
                              >
                                <Video className="w-4 h-4" /> Enable Camera Simulation
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive Questionnaire flow */}
                        <div className="glass-panel border-white/5 p-6 rounded-2xl">
                          {interviewStep === "setup" && (
                            <div className="flex flex-col items-center gap-6 py-8 text-center max-w-md mx-auto">
                              <h4 className="text-lg font-bold">Configure Simulator</h4>
                              <p className="text-xs text-slate-400">Select a career track directory path to focus the interview.</p>
                              
                              <div className="grid grid-cols-2 gap-3 w-full">
                                {(["Behavioral", "Coding", "HR", "System Design"] as const).map((track) => (
                                  <button
                                    key={track}
                                    onClick={() => setInterviewTrack(track)}
                                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                      interviewTrack === track ? "bg-purple-600 border-purple-500 text-white" : "bg-white/3 border-white/5 text-slate-400 hover:bg-white/5"
                                    }`}
                                  >
                                    {track}
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={() => {
                                  setInterviewStep("simulating");
                                  setCurrentQuestionIndex(0);
                                  setUserInterviewAnswer("");
                                }}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold text-xs text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                              >
                                Start Interactive Simulation
                              </button>
                            </div>
                          )}

                          {interviewStep === "simulating" && (
                            <div className="flex flex-col gap-4 text-left">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                <span className="text-xs text-pink-400 font-bold uppercase tracking-wider">{interviewTrack} Interview</span>
                                <span className="text-xs text-slate-500 font-semibold">Q {currentQuestionIndex + 1} of 3</span>
                              </div>

                              <p className="text-sm text-slate-200 font-semibold mb-4 leading-relaxed">
                                "{interviewQuestions[interviewTrack][currentQuestionIndex]}"
                              </p>

                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-slate-400 font-bold">Your Response (Type or use voice dictation)</label>
                                <div className="relative w-full">
                                  <textarea
                                    rows={4}
                                    placeholder="Type your response here..."
                                    value={userInterviewAnswer}
                                    onChange={(e) => setUserInterviewAnswer(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all text-xs text-slate-100 placeholder-slate-500 pr-12"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setUserInterviewAnswer("Based on my experiences, I handled this obstacle by building automated unit tests, leading the engineering scrum meetings, and working directly on deployment issues...")}
                                    className="absolute bottom-4 right-4 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 transition-all"
                                    title="Simulate Voice Input"
                                  >
                                    <Mic className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-4">
                                <button
                                  onClick={() => setInterviewStep("setup")}
                                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                                </button>
                                <button
                                  onClick={handleSendInterviewAnswer}
                                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors cursor-pointer"
                                >
                                  {currentQuestionIndex < 2 ? "Next Question" : "Complete & Analyze"}
                                </button>
                              </div>
                            </div>
                          )}

                          {interviewStep === "feedback" && (
                            <div className="flex flex-col gap-6 text-left">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                <span className="text-xs text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Analysis Complete
                                </span>
                                <button
                                  onClick={() => setInterviewStep("setup")}
                                  className="text-xs text-purple-400 hover:underline font-bold cursor-pointer"
                                >
                                  Restart Simulation
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Articulation Score</span>
                                  <span className="text-2xl font-black text-white">{aiInterviewFeedback.confidenceScore}%</span>
                                  <p className="text-[9px] text-slate-400 mt-2">{aiInterviewFeedback.commAnalysis}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Eye Contact Rate</span>
                                  <span className="text-2xl font-black text-white">{aiInterviewFeedback.eyeContactRating}</span>
                                  <p className="text-[9px] text-slate-400 mt-2">Stability of focus: High, direct alignment verified.</p>
                                </div>
                              </div>

                              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">STAR Review</span>
                                <p className="text-xs text-slate-300 leading-relaxed font-semibold">{aiInterviewFeedback.answerQuality}</p>
                              </div>

                              <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
                                <span className="text-[10px] text-pink-400 font-bold uppercase block mb-1">Improvement Tips</span>
                                <p className="text-xs text-slate-300 leading-relaxed font-semibold">{aiInterviewFeedback.improvementTips}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right col: Interview history logs */}
                      <div className="glass-panel border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <h4 className="text-sm font-bold border-b border-white/5 pb-2">Simulation Logs</h4>
                        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                          {user.interviewHistory.map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/2 text-xs flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-200">{item.role}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">{item.date}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-purple-400 font-bold">{item.type}</span>
                                <span className="text-green-400 font-bold">Score: {item.score}%</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1 italic">
                                "{item.feedback}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* COMMUNITY HUB VIEW */}
                {activeTab === "community" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">Community Hub</h3>
                      <p className="text-xs text-slate-400">Share learning milestones, hackathon requests, and collaborate with peers.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Feed */}
                      <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Create Post Form */}
                        <form onSubmit={handleCreatePost} className="glass-panel border-white/5 p-5 rounded-2xl flex gap-3">
                          <input
                            type="text"
                            placeholder="Share an accomplishment or course completion..."
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 placeholder-slate-500"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            Post
                          </button>
                        </form>

                        {/* Feed list */}
                        <div className="flex flex-col gap-4">
                          {communityPosts.map((post) => (
                            <div key={post.id} className="glass-panel border-white/5 p-5 rounded-2xl flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300">
                                    {post.author[0]}
                                  </div>
                                  <div className="text-left">
                                    <span className="text-xs font-bold text-slate-200 block leading-none">{post.author}</span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{post.role}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500">{post.date}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-2">{post.text}</p>
                              
                              <div className="flex items-center gap-4 mt-2 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-bold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCommunityPosts(communityPosts.map(p => {
                                      if (p.id === post.id) return { ...p, likes: p.likes + 1 };
                                      return p;
                                    }));
                                  }}
                                  className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  👍 {post.likes} Likes
                                </button>
                                <span>💬 {post.comments} Comments</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Channels/Stats */}
                      <div className="flex flex-col gap-6">
                        <div className="glass-panel border-white/5 p-5 rounded-2xl">
                          <h4 className="text-xs font-bold border-b border-white/5 pb-2 mb-3 uppercase tracking-wider text-slate-400">Active Channels</h4>
                          <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-300 hover:text-purple-400 cursor-pointer">#general-discussions</span>
                            <span className="text-xs text-slate-300 hover:text-purple-400 cursor-pointer">#hackathon-matchmaking</span>
                            <span className="text-xs text-slate-300 hover:text-purple-400 cursor-pointer">#resume-critique</span>
                            <span className="text-xs text-slate-300 hover:text-purple-400 cursor-pointer">#interview-prep-study</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
        <span className="text-xs text-slate-500">© 2026 CareerVerse Inc. All rights reserved.</span>
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
                {authMode === "login" 
                  ? "Enter credentials to unlock assessment tools" 
                  : authMode === "signup" 
                  ? "Sign up for a premium career dashboard" 
                  : "Enter your email address to receive a password reset link"}
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
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
                {authMode !== "forgot" && (
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
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition-colors mt-2 cursor-pointer"
                >
                  {authMode === "login" ? "Sign In" : authMode === "signup" ? "Register Account" : "Send Reset Link"}
                </button>
              </form>

              {/* Or divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">or</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/google-login";
                }}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/2 hover:bg-white/5 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-slate-200 mb-4"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zm0 0"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <div className="text-center text-xs text-slate-500 mt-6">
                {authMode === "login" ? (
                  <span>
                    New to CareerVerse?{" "}
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
                <h4 className="text-lg font-bold">CareerVerse Platform Walkthrough</h4>
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

      {/* D. Command Palette Overlay */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setCommandPaletteOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.97, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -10, opacity: 0 }}
              className="relative w-full max-w-lg glass-panel border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-white/2">
                <Search className="w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search modules, roadmaps, skills..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder-slate-500"
                  autoFocus
                />
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-bold">ESC</span>
              </div>

              {/* Suggestions / Options */}
              <div className="flex flex-col p-2 max-h-72 overflow-y-auto text-left">
                {[
                  { name: "Go to Career OS Dashboard", tab: "dashboard", desc: "View readiness score & daily missions" },
                  { name: "Predict Career Role", tab: "predictor", desc: "Take structured career path assessments" },
                  { name: "Review ATS Resume", tab: "resume", desc: "Upload and analyze resume compatibility" },
                  { name: "Generate Learning Roadmap", tab: "roadmap", desc: "Milestones for targeted career trajectories" },
                  { name: "Open AI Study Planner", tab: "study-planner", desc: "Weekly milestones & adaptive schedule" },
                  { name: "Start Mock Interview Lab", tab: "interview-lab", desc: "Interactive speech & composure mockups" },
                  { name: "Customize Portfolio Website", tab: "portfolio-builder", desc: "Interactive dark neon layout builder" },
                  { name: "Browse Community Hub", tab: "community", desc: "Collaborate on projects & hackathons" }
                ]
                  .filter(item => item.name.toLowerCase().includes(commandQuery.toLowerCase()) || item.desc.toLowerCase().includes(commandQuery.toLowerCase()))
                  .map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab(item.tab as any);
                        setCommandPaletteOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-purple-600/10 hover:border-purple-500/25 border border-transparent transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-200 block group-hover:text-purple-400 transition-colors">{item.name}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{item.desc}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                    </button>
                  ))}
              </div>

              {/* Palette Footer */}
              <div className="px-4 py-2 border-t border-white/5 bg-white/2 text-[9px] text-slate-500 font-semibold text-left">
                Tip: Press <kbd className="font-bold">Ctrl + K</kbd> anywhere to trigger Command Search.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. Floating AI Copilot Drawer Overlay */}
      <AnimatePresence>
        {copilotOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCopilotOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md h-full bg-[#0a041c] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-purple-400" /> CareerVerse Copilot
                    </h4>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block mt-0.5">Interactive Mentorship</span>
                  </div>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-4">
                {copilotMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed text-left ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-600 mt-1 uppercase font-semibold tracking-wider">
                      {msg.role === "user" ? "You" : "Copilot"}
                    </span>
                  </div>
                ))}
                {copilotLoading && (
                  <div className="self-start flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl rounded-tl-none">
                    <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                )}
                <div ref={copilotEndRef} />
              </div>

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSendCopilotSuggestion("Suggest an adaptive daily mission based on my goals.")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer"
                >
                  💡 Get Daily Mission
                </button>
                <button
                  type="button"
                  onClick={() => handleSendCopilotSuggestion("How can I improve my Career Readiness Score from " + (user?.readinessScore || 78) + "%?")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer"
                >
                  📈 Boost Readiness
                </button>
              </div>

              {/* Input box */}
              <form onSubmit={handleSendCopilotMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your Copilot anything..."
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
