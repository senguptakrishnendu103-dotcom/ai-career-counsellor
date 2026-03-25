// ================= ELEMENTS =================
const resultBox = document.getElementById("result");

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

// ================= SHOW LOADING =================
function showTyping() {
  resultBox.innerHTML = `
    <div class="card">🤖 AI is thinking...</div>
  `;
}

// ================= CAREER SEARCH =================
async function getCareer() {
  const input = document.getElementById("interest").value;

  showTyping(); // 🔥 loading effect

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

    typeText(card, content); // 🔥 typing animation
  });
}

// ================= SKILL CLICK =================
async function getSkillDetails(skill) {
  showTyping();

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

  typeText(card, content, 15); // 🔥 smooth typing
}

// ================= CLICK BIND =================
document.querySelectorAll("#skills span").forEach(el => {
  el.addEventListener("click", () => {
    getSkillDetails(el.innerText);
  });
});
