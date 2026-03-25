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
    keywords: ["ai","ml","data"]
  },
  {
    role: "Software Developer",
    salary: "₹6L - ₹20L",
    demand: "High",
    keywords: ["coding","javascript"]
  },
  {
    role: "Data Scientist",
    salary: "₹10L - ₹25L",
    demand: "Very High",
    keywords: ["data","analysis"]
  },
  {
    role: "UI/UX Designer",
    salary: "₹5L - ₹15L",
    demand: "Medium",
    keywords: ["design","ui"]
  },
  {
    role: "Cybersecurity Analyst",
    salary: "₹8L - ₹18L",
    demand: "High",
    keywords: ["security","cyber"]
  },
  {
    role: "Cloud Engineer",
    salary: "₹10L - ₹25L",
    demand: "Very High",
    keywords: ["cloud","aws"]
  }
];

// ================= SKILL DETAILS =================
const skillDetails = {
  "AI/ML": {
    role: "AI Engineer",
    roadmap: "Python → ML → Deep Learning → NLP → Projects",
    skills: ["Python","TensorFlow","PyTorch","Math"],
    levels: "Junior → ML Engineer → AI Architect",
    salary: "₹12L–₹30L",
    demand: "Very High",
    tip: "Build AI apps"
  },

  "React": {
    role: "Frontend Developer",
    roadmap: "HTML → CSS → JS → React",
    skills: ["JavaScript","React","Redux"],
    levels: "Junior → Senior Dev",
    salary: "₹6L–₹18L",
    demand: "High",
    tip: "Build UI projects"
  },

  "Node.js": {
    role: "Backend Developer",
    roadmap: "JS → Node → APIs → DB",
    skills: ["Node","Express","MongoDB"],
    levels: "Backend → Fullstack",
    salary: "₹7L–₹20L",
    demand: "High",
    tip: "Build APIs"
  },

  "Cloud": {
    role: "Cloud Engineer",
    roadmap: "Networking → AWS → Docker → Kubernetes",
    skills: ["AWS","Docker","Linux"],
    levels: "Engineer → Architect",
    salary: "₹10L–₹28L",
    demand: "Very High",
    tip: "Get AWS cert"
  },

  "Cybersecurity": {
    role: "Security Analyst",
    roadmap: "Networking → Security → Ethical Hacking",
    skills: ["Linux","Networking","Kali"],
    levels: "Analyst → Hacker",
    salary: "₹8L–₹18L",
    demand: "High",
    tip: "Practice labs"
  },

  "Data Science": {
    role: "Data Scientist",
    roadmap: "Python → Stats → ML",
    skills: ["Python","Pandas","SQL"],
    levels: "Analyst → Scientist",
    salary: "₹10L–₹25L",
    demand: "Very High",
    tip: "Kaggle projects"
  },

  "Blockchain": {
    role: "Blockchain Developer",
    roadmap: "JS → Solidity → Web3",
    skills: ["Solidity","Ethereum"],
    levels: "Dev → Architect",
    salary: "₹12L–₹35L",
    demand: "Growing",
    tip: "Build smart contracts"
  },

  "DevOps": {
    role: "DevOps Engineer",
    roadmap: "Linux → Git → CI/CD → Docker",
    skills: ["Docker","Kubernetes"],
    levels: "Engineer → Platform Engineer",
    salary: "₹10L–₹30L",
    demand: "Very High",
    tip: "Automate pipelines"
  },

  "UI/UX": {
    role: "UI/UX Designer",
    roadmap: "Design → Figma → UX Research",
    skills: ["Figma","Adobe XD"],
    levels: "Designer → Lead",
    salary: "₹5L–₹15L",
    demand: "Medium",
    tip: "Design apps"
  },

  "Finance": {
    role: "Financial Analyst",
    roadmap: "Accounting → Excel → Finance Modeling",
    skills: ["Excel","Finance","Analysis"],
    levels: "Analyst → Investment Banker",
    salary: "₹6L–₹20L",
    demand: "High",
    tip: "Learn stock market"
  }
};

// ================= ROUTES =================
app.get("/api/data", (req, res) => {
  visitors++;
  res.json({ visitors, skills });
});

app.post("/api/career", (req, res) => {
  const input = req.body.interest?.toLowerCase() || "";

  let results = careerData.filter(c =>
    c.keywords.some(k => input.includes(k))
  );

  if (results.length === 0) results = careerData;

  res.json({ careers: results });
});

app.post("/api/skill-details", (req, res) => {
  const { skill } = req.body;

  const result = skillDetails[skill];

  if (!result) {
    return res.json({
      role: skill,
      roadmap: "Learn basics + build projects",
      skills: ["General Skills"],
      levels: "Beginner → Advanced",
      salary: "Varies",
      demand: "Growing",
      tip: "Stay consistent"
    });
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
