/* public/script.js */
// ================= ELEMENTS =================
const viewSearch = document.getElementById("view-search");
const viewQuiz = document.getElementById("view-quiz");
const viewResume = document.getElementById("view-resume");
const resultArea = document.getElementById("resultArea");
const resultContent = document.getElementById("resultContent");
const loadingIndicator = document.getElementById("loading");
const statsBox = document.getElementById("stats");
const interestInput = document.getElementById("interest");
const resumeUpload = document.getElementById("resumeUpload");
const uploadBtn = document.getElementById("uploadBtn");
const fileNameDisplay = document.getElementById("fileNameDisplay");

// ================= INITIALIZATION =================
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

// ================= UI NAVIGATION =================
function switchTab(tabId) {
  // Update buttons
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`tab-${tabId}`).classList.add("active");

  // Update views
  document.querySelectorAll(".view-section").forEach(view => view.classList.remove("active", "hidden"));
  if (tabId === 'search') {
    viewSearch.classList.add("active");
    viewQuiz.classList.add("hidden");
    viewResume.classList.add("hidden");
  } else if (tabId === 'quiz') {
    viewSearch.classList.add("hidden");
    viewQuiz.classList.add("active");
    viewResume.classList.add("hidden");
  } else if (tabId === 'resume') {
    viewSearch.classList.add("hidden");
    viewQuiz.classList.add("hidden");
    viewResume.classList.add("active");
  }
  
  resultArea.classList.add("hidden");
}

function quickSearch(term) {
  interestInput.value = term;
  getCareer();
}

// ================= AI COMMUNICATION =================
async function fetchAIResponse(payload) {
  resultArea.classList.remove("hidden");
  loadingIndicator.classList.remove("hidden");
  resultContent.innerHTML = "";

  try {
    const res = await fetch("/api/counsel", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (res.ok) {
      renderResult(data);
    } else {
      renderError(data.error || "An error occurred.");
    }
  } catch (err) {
    renderError("Failed to connect to the server.");
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

// ================= RESUME UPLOAD FLOW =================
resumeUpload.addEventListener("change", function() {
  if (this.files && this.files.length > 0) {
    fileNameDisplay.innerText = "Selected: " + this.files[0].name;
    uploadBtn.disabled = false;
  } else {
    fileNameDisplay.innerText = "";
    uploadBtn.disabled = true;
  }
});

async function uploadResume() {
  const file = resumeUpload.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("resume", file);

  resultArea.classList.remove("hidden");
  loadingIndicator.classList.remove("hidden");
  resultContent.innerHTML = "";

  try {
    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    
    if (res.ok) {
      renderResult(data);
    } else {
      renderError(data.error || "An error occurred.");
    }
  } catch (err) {
    renderError("Failed to parse resume.");
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

// ================= SEARCH FLOW =================
function getCareer() {
  const input = interestInput.value.trim();
  if (!input) return;
  fetchAIResponse({ interest: input });
}

interestInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getCareer();
  }
});

// ================= QUIZ FLOW =================
const questions = [
  { q: "How much do you enjoy problem-solving and coding logic?", field: "tech" },
  { q: "Do you like analyzing numbers, patterns, or datasets?", field: "data" },
  { q: "Are you passionate about visual aesthetics and user experience?", field: "design" },
  { q: "Do you prefer strategic planning, management, and business growth?", field: "business" }
];

let quizIndex = 0;
let answers = { tech: 0, data: 0, design: 0, business: 0 };

function startQuiz() {
  quizIndex = 0;
  answers = { tech: 0, data: 0, design: 0, business: 0 };
  showQuestion();
}

function showQuestion() {
  if (quizIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[quizIndex];
  const quizBox = document.getElementById("quizBox");
  
  quizBox.innerHTML = `
    <h3>Question ${quizIndex + 1} of ${questions.length}</h3>
    <p style="font-size: 1.2rem; margin: 20px 0;">${q.q}</p>
    <div class="quiz-answers">
      <button onclick="answerQuiz(10)" class="btn-primary">Absolutely! 😍</button>
      <button onclick="answerQuiz(5)" class="btn-secondary">It's okay 🤔</button>
      <button onclick="answerQuiz(0)" class="btn-secondary" style="border-color: rgba(255,0,0,0.3)">Not really 🙅‍♂️</button>
    </div>
  `;
}

function answerQuiz(score) {
  answers[questions[quizIndex].field] += score;
  quizIndex++;
  showQuestion();
}

function finishQuiz() {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = `
    <h3>Analysis Complete!</h3>
    <p>We've gathered enough data to find your perfect role.</p>
    <button onclick="restartQuiz()" class="btn-secondary">Restart Quiz</button>
  `;
  fetchAIResponse({ answers: answers });
}

function restartQuiz() {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = `
    <h3>Not sure what to do?</h3>
    <p>Let our AI evaluate your profile through 4 quick questions.</p>
    <button onclick="startQuiz()" class="btn-secondary">Start Assessment 🚀</button>
  `;
  resultArea.classList.add("hidden");
}

// ================= RENDER =================
function renderResult(data) {
  let roadmapHtml = '';
  if (Array.isArray(data.roadmap)) {
    roadmapHtml = `
      <div class="timeline">
        ${data.roadmap.map((item, idx) => `
          <div class="timeline-item">
            <div class="timeline-step">Step ${idx + 1}</div>
            <div class="timeline-title">${item.title || "Next Step"}</div>
            <div class="timeline-desc">${item.description || ""}</div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (typeof data.roadmap === 'string') {
    const parsedText = data.roadmap
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)/g, '<li>$1</li>');
    roadmapHtml = `<p class="roadmap-text-fallback">🗺️ ${parsedText}</p>`;
  } else {
    roadmapHtml = `<p>🗺️ Learn basics, build projects, apply.</p>`;
  }

  const html = `
    <div class="result-card">
      <div class="result-header">
        <h2>${data.role || "Unknown Role"}</h2>
        <p style="color: var(--text-muted)">Based on Gemini AI Analysis ✨</p>
      </div>
      
      <div class="result-grid">
        <div class="data-group">
          <h4>Expected Salary</h4>
          <p>💰 ${data.salary || "Variable"}</p>
        </div>
        <div class="data-group">
          <h4>Market Demand</h4>
          <p>📈 ${data.demand || "High"}</p>
        </div>
        <div class="data-group">
          <h4>Career Levels</h4>
          <p>🚀 ${data.levels || "Junior -> Senior"}</p>
        </div>
      </div>
      
      <div class="data-group" style="margin-bottom: 24px;">
        <h4>Key Skills</h4>
        <ul>
          ${(data.skills || []).map(skill => `<li>${skill}</li>`).join("")}
        </ul>
      </div>

      <div class="data-group" style="margin-bottom: 24px;">
        <h4>Suggested Roadmap</h4>
        ${roadmapHtml}
      </div>
      
      <div class="tip-box" style="margin-bottom: 24px;">
        <h4>Pro Tip 🔥</h4>
        <p>${data.tip || "Stay consistent and build projects."}</p>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <button onclick="downloadPDF(event)" class="btn-primary pdf-btn" style="margin: 0 auto; display: inline-flex;">
          Download PDF Roadmap <span class="icon">📥</span>
        </button>
      </div>
    </div>
  `;
  resultContent.innerHTML = html;
}

function renderError(msg) {
  resultContent.innerHTML = `
    <div class="result-card" style="border-color: rgba(239, 68, 68, 0.3)">
      <h3 style="color: #f87171; margin-bottom: 10px;">⚠️ Analysis Failed</h3>
      <p>${msg}</p>
      <p style="font-size: 0.9rem; margin-top: 10px; color: var(--text-muted)">Ensure you have a valid GEMINI_API_KEY in your .env file and check file types.</p>
    </div>
  `;
}

function downloadPDF(event) {
  const btn = event.currentTarget;
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Generating PDF... <span class="spinner-small"></span>';
  btn.disabled = true;

  const element = document.getElementById("resultContent");
  
  const opt = {
    margin:       15,
    filename:     'Career_Roadmap.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  element.classList.add("pdf-mode");

  html2pdf().set(opt).from(element).save().then(() => {
    element.classList.remove("pdf-mode");
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(err => {
    console.error("PDF generation error:", err);
    element.classList.remove("pdf-mode");
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
}
