const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// ================= VISITOR =================
let visitors = 0;

// ================= SKILLS =================
const skills = [
  "AI/ML","React","Node.js","Cloud","Cybersecurity",
  "Data Science","Blockchain","DevOps","UI/UX","Finance"
];

// ================= CAREER DATA =================
const careerData = [
  {
    role: "AI Engineer",
    salary: "₹12L - ₹30L",
    demand: "Very High",
    keywords: ["ai","ml","data","python"]
  },
  {
    role: "Software Developer",
    salary: "₹6L - ₹20L",
    demand: "High",
    keywords: ["coding","javascript","web"]
  },
  {
    role: "Data Scientist",
    salary: "₹10L - ₹25L",
    demand: "Very High",
    keywords: ["data","analysis","statistics"]
  },
  {
    role: "UI/UX Designer",
    salary: "₹5L - ₹15L",
    demand: "Medium",
    keywords: ["design","ui","ux"]
  },
  {
    role: "Cybersecurity Analyst",
    salary: "₹8L - ₹18L",
    demand: "High",
    keywords: ["security","cyber","hacking"]
  },
  {
    role: "Cloud Engineer",
    salary: "₹10L - ₹22L",
    demand: "Very High",
    keywords: ["cloud","aws","devops"]
  }
];

// ================= API: DASHBOARD =================
app.get("/api/data", (req, res) => {
  visitors++;

  res.json({
    visitors,
    skills
  });
});

// ================= API: CAREER =================
app.post("/api/career", (req, res) => {
  const { interest } = req.body;

  let input = (interest || "").toLowerCase();

  let results = careerData.filter(c =>
    c.keywords.some(k => input.includes(k))
  );

  if (results.length === 0) {
    results = careerData.slice(0, 4);
  }

  res.json({
    message: "Career suggestions based on your interest:",
    careers: results
  });
});

// ================= API: SKILL DETAILS =================
app.post("/api/skill-details", (req, res) => {
  const { skill } = req.body;

  const data = {
    "AI/ML": {
      role: "AI Engineer",
      roadmap: "Python → ML → Deep Learning → Projects",
      skills: ["Python","TensorFlow","Math","Data"],
      levels: "Junior → ML Engineer → AI Specialist",
      salary: "₹12L–₹30L (India), $100k+",
      demand: "Very High",
      tip: "Build AI projects (chatbots, models)"
    },
    "React": {
      role: "Frontend Developer",
      roadmap: "HTML → CSS → JS → React",
      skills: ["JS","React","UI"],
      levels: "Junior → Frontend → Senior",
      salary: "₹6L–₹18L",
      demand: "High",
      tip: "Build portfolio websites"
    },
    "Node.js": {
      role: "Backend Developer",
      roadmap: "JS → Node → APIs",
      skills: ["Node","Express","DB"],
      levels: "Backend → Fullstack",
      salary: "₹7L–₹20L",
      demand: "High",
      tip: "Master APIs"
    },
    "Cybersecurity": {
      role: "Security Analyst",
      roadmap: "Networking → Security → Ethical Hacking",
      skills: ["Linux","Networking"],
      levels: "Analyst → Security Engineer",
      salary: "₹8L–₹18L",
      demand: "High",
      tip: "Practice real hacking labs"
    },
    "Data Science": {
      role: "Data Scientist",
      roadmap: "Python → Stats → ML",
      skills: ["Python","SQL","Stats"],
      levels: "Analyst → Scientist",
      salary: "₹10L–₹25L",
      demand: "Very High",
      tip: "Work on datasets"
    }
  };

  const result = data[skill] || {
    role: skill,
    roadmap: "Learn basics + build projects",
    skills: ["General Skills"],
    levels: "Beginner → Advanced",
    salary: "Varies",
    demand: "Growing",
    tip: "Stay consistent"
  };

  res.json(result);
});

// ================= UPGRADE (SMART RESPONSE) =================
// 🔥 More human-like explanation (bonus upgrade)
app.post("/api/ai-advice", (req, res) => {
  const { interest } = req.body;

  let response = `Based on your interest in "${interest}", you can explore multiple career paths. Focus on building skills, real projects, and consistency.`;

  res.json({ advice: response });
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
