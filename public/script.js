// ================= ELEMENTS =================
const resultBox = document.getElementById("result");
const quizBox = document.getElementById("quizBox");
const statsBox = document.getElementById("stats");

// ================= BACKGROUND =================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animate);
}
animate();

// ================= VISITOR =================
async function loadStats() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    statsBox.innerHTML = `👀 Visitors: ${data.visitors}`;
  } catch {
    statsBox.innerHTML = "👀 Visitors: --";
  }
}
loadStats();

// ================= TYPE EFFECT =================
function typeText(el, text) {
  el.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      el.innerHTML += text[i];
      i++;
      setTimeout(typing, 10);
    }
  }

  typing();
}

// ================= CAREER SEARCH =================
async function getCareer() {
  const input = document.getElementById("interest").value;
  if (!input) return;

  resultBox.innerHTML = `<div class="card">🤖 Thinking...</div>`;

  const res = await fetch("/api/career", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({interest: input})
  });

  const data = await res.json();
  resultBox.innerHTML = "";

  data.careers.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";

    const text = `
🚀 ${c.role}

💰 Salary: ${c.salary}
📊 Demand: ${c.demand}
    `;

    resultBox.appendChild(card);
    typeText(card, text);
  });
}

// ================= SKILL CLICK =================
async function getSkillDetails(skill) {
  resultBox.innerHTML = `<div class="card">🤖 Loading...</div>`;

  const res = await fetch("/api/skill-details", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({skill})
  });

  const data = await res.json();
  resultBox.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card";

  const text = `
🚀 ${data.role}

🗺 Roadmap: ${data.roadmap}
🧠 Skills: ${data.skills.join(", ")}

📈 Career Path: ${data.levels}
💰 Salary: ${data.salary}
📊 Demand: ${data.demand}

🔥 Tip: ${data.tip}
  `;

  resultBox.appendChild(card);
  typeText(card, text);
}

// ================= QUIZ =================
let quizIndex = 0;

const questions = [
  { q: "Do you enjoy coding?", field: "tech" },
  { q: "Do you like analyzing data?", field: "data" },
  { q: "Are you creative?", field: "design" },
  { q: "Do you like business?", field: "business" }
];

let answers = {
  tech: 0,
  data: 0,
  design: 0,
  business: 0
};

function startQuiz() {
  quizIndex = 0;
  answers = { tech: 0, data: 0, design: 0, business: 0 };

  resultBox.innerHTML = ""; // clear old cards
  showQuestion();
}

function showQuestion() {
  if (quizIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[quizIndex];

  quizBox.innerHTML = `
    <div class="card">
      <h3>${q.q}</h3><br>
      <button onclick="answerQuiz(true)">Yes</button>
      <button onclick="answerQuiz(false)">No</button>
    </div>
  `;
}

function answerQuiz(ans) {
  if (ans) {
    answers[questions[quizIndex].field]++;
  }

  quizIndex++;
  showQuestion();
}

// 🔥 IMPORTANT: FETCH FULL DETAILS
async function showResult() {
  let best = Object.keys(answers).reduce((a,b)=>
    answers[a] > answers[b] ? a : b
  );

  let skillMap = {
    tech: "React",
    data: "Data Science",
    design: "UI/UX",
    business: "Finance"
  };

  const selectedSkill = skillMap[best];

  quizBox.innerHTML = `
    <div class="card">
      <h2>🎯 Suggested Career</h2>
      <br>
      <strong>${selectedSkill}</strong>
      <br><br>
      <button onclick="restartQuiz()">🔄 Start Again</button>
    </div>
  `;

  // 🔥 LOAD FULL DETAILS INTO RESULT BOX
  getSkillDetails(selectedSkill);
}

function restartQuiz() {
  quizBox.innerHTML = `
    <h2>🧠 Not sure? Answer a few questions</h2>
    <button onclick="startQuiz()">Start Questions</button>
  `;
}
