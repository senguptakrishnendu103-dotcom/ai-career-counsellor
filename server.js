const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// ================= VISITOR =================
let visitors = 0;

// ================= DATA =================
const skills = [
  "AI/ML","React","Node.js","Cloud","Cybersecurity",
  "Data Science","Blockchain","DevOps","UI/UX","Finance"
];

const careerData = [
  {
    role: "AI Engineer",
    salary: "₹12L - ₹30L",
    demand: "Very High",
    keywords: ["ai","ml","data","python","automation"]
  },
  {
    role: "Software Developer",
    salary: "₹6L - ₹20L",
    demand: "High",
    keywords: ["coding","javascript","web","app","developer"]
  },
  {
    role: "Data Scientist",
    salary: "₹10L - ₹25L",
    demand: "Very High",
    keywords: ["data","analysis","statistics","machine learning"]
  },
  {
    role: "UI/UX Designer",
    salary: "₹5L - ₹15L",
    demand: "Medium",
    keywords: ["design","ui","ux","creative","figma"]
  },
  {
    role: "Cybersecurity Analyst",
    salary: "₹8L - ₹18L",
    demand: "High",
    keywords: ["security","hacking","network","cyber"]
  },
  {
    role: "Cloud Engineer",
    salary: "₹10L - ₹22L",
    demand: "Very High",
    keywords: ["cloud","aws","azure","devops"]
  },
  {
    role: "Business Analyst",
    salary: "₹6L - ₹18L",
    demand: "High",
    keywords: ["business","analysis","management"]
  }
];

// ================= API: DASHBOARD =================
app.get("/api/data", (req, res) => {
  visitors++;

  res.json({
    visitors,
    skills,
    careers: careerData
  });
});

// ================= API: CAREER =================
app.post("/api/career", (req, res) => {
  const { interest } = req.body;

  let input = (interest || "").toLowerCase();

  // 🔥 match based on keywords
  let results = careerData.filter(c =>
    c.keywords.some(k => input.includes(k))
  );

  // if nothing matched → show top roles
  if (results.length === 0) {
    results = careerData.slice(0, 4);
  }

  res.json({
    message: "Here are career suggestions based on your interest:",
    careers: results
  });
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
