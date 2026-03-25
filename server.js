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
// ================= LOAD DATA =================
fetch("/api/data")
.then(res => res.json())
.then(data => {
  document.getElementById("stats").innerText =
    `👀 Visitors: ${data.visitors}`;

  const skillsDiv = document.getElementById("skills");
  skillsDiv.innerHTML = "";

  data.skills.forEach(skill => {
    const span = document.createElement("span");
    span.innerText = skill;

    // 🔥 CLICK EVENT
    span.onclick = () => loadSkillDetails(skill);

    skillsDiv.appendChild(span);
  });
});

// ================= SKILL DETAILS =================
function loadSkillDetails(skill){
  fetch("/api/skill-details",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({skill})
  })
  .then(res=>res.json())
  .then(showSkillDetails);
}

function showSkillDetails(data){
  const results = document.getElementById("results");

  results.innerHTML = `
    <div class="card">
      <h2>🚀 ${data.role}</h2>

      <p><b>🛣️ Roadmap:</b> ${data.roadmap}</p>
      <p><b>🧠 Skills:</b> ${data.skills.join(", ")}</p>
      <p><b>💼 Career Path:</b> ${data.levels}</p>
      <p><b>💰 Salary:</b> ${data.salary}</p>
      <p><b>📈 Demand:</b> ${data.demand}</p>
      <p><b>🔥 Tip:</b> ${data.tip}</p>
    </div>
  `;
}

// ================= CHAT SYSTEM =================
function findCareer() {
  const input = document.getElementById("interest").value.trim();

  if (!input) {
    alert("Enter interest first!");
    return;
  }

  document.getElementById("quizBox").innerHTML = "";
  document.getElementById("results").innerHTML = "";

  fetch("/api/career", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({interest: input})
  })
  .then(res=>res.json())
  .then(showResults);
}

// ================= QUIZ =================
const questions = [
  "Do you enjoy coding?",
  "Are you interested in data?",
  "Do you like design?",
  "Interested in cybersecurity?"
];

let answers = [];
let currentQ = 0;

function startQuiz(){
  answers = [];
  currentQ = 0;

  document.getElementById("quizBox").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("interest").value = "";

  askQuestion();
}

function askQuestion(){
  const box = document.getElementById("quizBox");

  if(currentQ >= questions.length){
    analyzeQuiz();
    return;
  }

  box.innerHTML = `
    <p>${questions[currentQ]}</p>
    <button onclick="answer('yes')">Yes</button>
    <button onclick="answer('no')">No</button>
  `;
}

function answer(ans){
  answers.push({q:questions[currentQ],a:ans});
  currentQ++;
  askQuestion();
}

function analyzeQuiz(){
  let interest="";

  answers.forEach(a=>{
    if(a.q.includes("coding") && a.a==="yes") interest+=" coding";
    if(a.q.includes("data") && a.a==="yes") interest+=" data";
    if(a.q.includes("design") && a.a==="yes") interest+=" design";
    if(a.q.includes("cyber") && a.a==="yes") interest+=" security";
  });

  fetch("/api/career",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({interest})
  })
  .then(res=>res.json())
  .then(d=>{
    document.getElementById("quizBox").innerHTML="";
    showResults(d);
  });
}

// ================= SHOW RESULTS =================
function showResults(data){
  const results = document.getElementById("results");
  results.innerHTML = "";

  data.careers.forEach(c=>{
    const div=document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <h3>${c.role}</h3>
      <p>💰 Salary: ${c.salary}</p>
      <p>📈 Demand: ${c.demand}</p>
    `;

    results.appendChild(div);
  });
}

// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
