const quiz=[
"Do you enjoy solving logical problems?",
"Do you like leading people?",
"Are you creative?",
"Do you like helping others?",
"Do you like arguing?",
"Do you like numbers?",
"Do you enjoy sports?"
];

let ans=[],i=0;

// Progress
function updateProgress(){
 const percent = ((i) / quiz.length) * 100;
 document.getElementById("progressBar").style.width = percent + "%";
}

function showQ(){
 if(i>=quiz.length) return submit();

 updateProgress();

 document.getElementById("quiz").innerHTML=
 `<div class="fade-in">
   <h2>${quiz[i]}</h2>
   <button onclick="answer('yes')">Yes</button>
   <button onclick="answer('no')">No</button>
  </div>`;
}

function answer(a){
 ans.push(a+" "+quiz[i]);

 const div=document.createElement("div");
 div.innerText=ans[ans.length-1];
 document.getElementById("history").appendChild(div);

 i++;
 showQ();
}

// Typing effect
function typeText(el,text,speed=20){
 el.innerHTML="";
 let i=0;
 function t(){
  if(i<text.length){
   el.innerHTML+=text.charAt(i);
   i++;
   setTimeout(t,speed);
  }
 }
 t();
}

// 🔥 Step-by-step AI reveal
async function submit(){
 document.getElementById("quiz").innerHTML="";
 document.getElementById("progressBar").style.width="100%";

 const dashboard = document.getElementById("dashboard");

 dashboard.innerHTML = `<h2>🧠 AI Thinking...</h2>`;

 // Step 1
 await delay(800);
 appendStep("🔍 Analyzing your answers...");

 // Step 2
 await delay(1200);
 appendStep("🧠 Mapping personality traits...");

 // Step 3
 await delay(1200);
 appendStep("📊 Calculating domain scores...");

 // API call happens during thinking
 const res=await fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({answers:ans})
 });
 const data=await res.json();

 // Step 4
 await delay(1000);
 appendStep("🏆 Generating career ranking...");

 // Step 5
 await delay(1000);
 appendStep("📈 Building explanation...");

 // Final reveal
 await delay(800);

 dashboard.innerHTML = `
 <div class="fade-in">
   <h2>🏆 Results</h2>
   <pre id="resultText"></pre>

   <h3>🧠 Explanation</h3>
   <div class="card" id="explanationText"></div>

   <canvas id="chart"></canvas>
 </div>
 `;

 typeText(document.getElementById("resultText"), data.ranking, 15);

 setTimeout(()=>{
   typeText(document.getElementById("explanationText"), data.explanation, 10);
 }, 800);

 new Chart(document.getElementById("chart"),{
  type:"radar",
  data:{
   labels:Object.keys(data.scores),
   datasets:[{
    data:Object.values(data.scores),
    borderColor:"#00ffff"
   }]
  }
 });
}

// Helper delay
function delay(ms){
 return new Promise(res => setTimeout(res, ms));
}

// Add thinking steps
function appendStep(text){
 const div = document.createElement("div");
 div.classList.add("fade-in");
 div.innerText = text;
 document.getElementById("dashboard").appendChild(div);
}

showQ();