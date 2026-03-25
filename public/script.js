// ================= ELEMENTS =================
const resultBox = document.getElementById("result");
const quizBox = document.getElementById("quizBox");
const statsBox = document.getElementById("stats");

// ================= LOAD VISITOR =================
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

// ================= TYPE ANIMATION =================
function typeText(element, text, speed = 20) {
  element.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}

// ================= LOADING =================
function showTyping() {
  resultBox.innerHTML = `<div class="card">🤖 AI is thinking...</div>`;
}

// ================= CAREER SEARCH =================
async function getCareer() {
  const input = document.getElementById("interest").value;

  if (!input) return;

  showTyping();

  try {
    const res = await fetch("/api/career", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interest: input })
    });

    const data = await res.json();

    resultBox.innerHTML = "";

    data.careers.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";

      const content = `
🚀 ${c.role}

💰 Salary: ${c.salary}
📊 Demand: ${c.demand}
`;

      resultBox.appendChild(card);
      typeText(card, content);
    });

  } catch (err) {
    resultBox.innerHTML = `<div class="card">❌ Error loading data</div>`;
  }
}

// ================= SKILL DETAILS =================
async function getSkillDetails(skill) {
  showTyping();

  try {
    const res = await fetch("/api/skill-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill })
    });

    const data = await res.json();

    resultBox.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";

    const content = `
🚀 ${data.role}

🗺 Roadmap: ${data.roadmap}
🧠 Skills: ${data.skills.join(", ")}

📈 Career Path: ${data.levels}
💰 Salary: ${data.salary}
📊 Demand: ${data.demand}

🔥 Tip: ${data.tip}
`;

    resultBox.appendChild(card);
    typeText(card, content, 15);

  } catch (err) {
    resultBox.innerHTML = `<div class="card">❌ Failed to load skill</div>`;
  }
}

// ================= QUIZ SYSTEM =================
let quizIndex = 0;

const questions = [
  { q: "Do you enjoy coding?", field: "tech" },
  { q: "Do you like analyzing data?", field: "data" },
  { q: "Are you creative?", field: "design" },
  { q: "Do you like business and finance?", field: "business" }
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

  showQuestion();
}

function showQuestion() {
  if (quizIndex >= questions.length) {
    showResult();
    return;
  }

  const current = questions[quizIndex];

  quizBox.innerHTML = `
    <h3>${current.q}</h3>
    <button onclick="answerQuiz(true)">Yes</button>
    <button onclick="answerQuiz(false)">No</button>
  `;
}

function answerQuiz(ans) {
  const field = questions[quizIndex].field;

  if (ans) answers[field]++;

  quizIndex++;
  showQuestion();
}

function showResult() {
  quizBox.innerHTML = "<h3>Analyzing your answers...</h3>";

  setTimeout(() => {
    let bestField = Object.keys(answers).reduce((a, b) =>
      answers[a] > answers[b] ? a : b
    );

    let suggestion = "";

    if (bestField === "tech") {
      suggestion = "💻 Software Developer / AI Engineer";
    } else if (bestField === "data") {
      suggestion = "📊 Data Scientist";
    } else if (bestField === "design") {
      suggestion = "🎨 UI/UX Designer";
    } else {
      suggestion = "💼 Business / Finance Roles";
    }

    quizBox.innerHTML = `
      <div class="card">
        🎯 Suggested Career:<br><br>
        <strong>${suggestion}</strong>
      </div>
    `;
  }, 1200);
}
