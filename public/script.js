// ================= LOAD DATA =================
fetch("/api/data")
.then(r=>r.json())
.then(d=>{
 document.getElementById("stats").innerText =
 `👀 Visitors: ${d.visitors}`;

 d.skills.forEach(s=>{
  const span=document.createElement("span");
  span.innerText=s;
  document.getElementById("skills").appendChild(span);
 });
});

// ================= CHAT SYSTEM =================

function findCareer(){
 const interest = document.getElementById("interest").value;

 fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({interest})
 })
 .then(r=>r.json())
 .then(showResults);
}

// ================= QUIZ SYSTEM =================

const questions = [
  "Do you enjoy coding?",
  "Are you interested in data?",
  "Do you like design?",
  "Are you interested in cybersecurity?"
];

let answers = [];
let currentQ = 0;

// 🔥 START QUIZ (RESET EVERYTHING)
function startQuiz(){
 answers = [];
 currentQ = 0;

 // ✅ CLEAR OLD DISCUSSION
 document.getElementById("quizBox").innerHTML = "";

 askQuestion();
}

// 🔥 ASK QUESTION
function askQuestion(){
 if(currentQ >= questions.length){
   analyzeQuiz();
   return;
 }

 const q = questions[currentQ];

 document.getElementById("quizBox").innerHTML = `
   <p>${q}</p>
   <button onclick="answer('yes')">Yes</button>
   <button onclick="answer('no')">No</button>
 `;
}

// 🔥 STORE ANSWER
function answer(ans){
 answers.push({q:questions[currentQ], a:ans});
 currentQ++;
 askQuestion();
}

// 🔥 ANALYZE QUIZ
function analyzeQuiz(){
 let interest = "";

 answers.forEach(a=>{
   if(a.q.includes("coding") && a.a==="yes") interest += " coding";
   if(a.q.includes("data") && a.a==="yes") interest += " data";
   if(a.q.includes("design") && a.a==="yes") interest += " design";
   if(a.q.includes("cybersecurity") && a.a==="yes") interest += " security";
 });

 fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({interest})
 })
 .then(r=>r.json())
 .then(d=>{
   // 🔥 CLEAR QUIZ AFTER RESULT
   document.getElementById("quizBox").innerHTML = "";
   showResults(d);
 });
}

// ================= SHOW RESULTS =================

function showResults(d){
 const results = document.getElementById("results");
 results.innerHTML = "";

 d.careers.forEach(c=>{
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
