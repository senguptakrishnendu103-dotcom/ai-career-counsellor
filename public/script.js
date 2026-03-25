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
