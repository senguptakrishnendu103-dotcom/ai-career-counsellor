// load data
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

// ================= QUESTION SYSTEM =================

const questions = [
  "Do you enjoy coding?",
  "Are you interested in data and analytics?",
  "Do you like creative design?",
  "Are you interested in cybersecurity?"
];

let answers = [];
let currentQ = 0;

function startQuiz(){
 document.getElementById("quizBox").innerHTML = "";
 answers = [];
 currentQ = 0;
 askQuestion();
}

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

function answer(ans){
 answers.push({q:questions[currentQ], a:ans});
 currentQ++;
 askQuestion();
}

// ================= QUIZ ANALYSIS =================

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
 .then(showResults);
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
