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
    skillsDiv.appendChild(span);
  });
});

// ================= CHAT SYSTEM =================
function findCareer() {
  const input = document.getElementById("interest").value.trim();

  if (!input) {
    alert("Please enter your interest first!");
    return;
  }

  // 🔥 CLEAR QUIZ + OLD RESULTS
  document.getElementById("quizBox").innerHTML = "";
  document.getElementById("results").innerHTML = "";

  fetch("/api/career", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interest: input })
  })
    .then(res => res.json())
    .then(showResults);
}

// ================= QUIZ SYSTEM =================

const questions = [
  "Do you enjoy coding?",
  "Are you interested in data and analytics?",
  "Do you like creative design?",
  "Are you interested in cybersecurity?"
];

let answers = [];
let currentQ = 0;

// 🔥 START QUIZ (FULL RESET)
function startQuiz() {
  answers = [];
  currentQ = 0;

  // 🔥 CLEAR EVERYTHING
  document.getElementById("quizBox").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("interest").value = "";

  askQuestion();
}

// 🔥 ASK QUESTION
function askQuestion() {
  const box = document.getElementById("quizBox");

  if (currentQ >= questions.length) {
    analyzeQuiz();
    return;
  }

  box.innerHTML = `
    <p>${questions[currentQ]}</p>
    <button onclick="answer('yes')">Yes</button>
    <button onclick="answer('no')">No</button>
  `;
}

// 🔥 SAVE ANSWER
function answer(ans) {
  answers.push({
    question: questions[currentQ],
    answer: ans
  });

  currentQ++;
  askQuestion();
}

// 🔥 ANALYZE QUIZ
function analyzeQuiz() {
  let interest = "";

  answers.forEach(a => {
    if (a.question.includes("coding") && a.answer === "yes") interest += " coding";
    if (a.question.includes("data") && a.answer === "yes") interest += " data";
    if (a.question.includes("design") && a.answer === "yes") interest += " design";
    if (a.question.includes("cybersecurity") && a.answer === "yes") interest += " security";
  });

  fetch("/api/career", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interest })
  })
    .then(res => res.json())
    .then(data => {
      // 🔥 CLEAR QUIZ AFTER FINISH
      document.getElementById("quizBox").innerHTML = "";
      showResults(data);
    });
}

// ================= SHOW RESULTS =================
function showResults(data) {
  const results = document.getElementById("results");

  // 🔥 ALWAYS CLEAR BEFORE ADDING
  results.innerHTML = "";

  if (!data.careers || data.careers.length === 0) {
    results.innerHTML = "<p>No results found</p>";
    return;
  }

  data.careers.forEach(career => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${career.role}</h3>
      <p>💰 Salary: ${career.salary}</p>
      <p>📈 Demand: ${career.demand}</p>
    `;

    results.appendChild(card);
  });
}
