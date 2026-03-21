const quiz=[
"Do you enjoy logical thinking?",
"Do you like leadership?",
"Are you creative?",
"Do you like helping others?",
"Do you like arguments?",
"Do you like numbers?"
];

let ans=[],i=0;

function startQuiz(){
 document.getElementById("welcome").style.display="none";
 showQ();
}

function updateProgress(){
 document.getElementById("progressBar").style.width=(i/quiz.length)*100+"%";
}

function showQ(){
 if(i>=quiz.length) return submit();

 updateProgress();

 document.getElementById("quiz").innerHTML=
 `<h2>${quiz[i]}</h2>
 <button onclick="answer('yes')">Yes</button>
 <button onclick="answer('no')">No</button>`;
}

function answer(a){
 ans.push(a+" "+quiz[i]);
 i++;showQ();
}

async function submit(){
 document.getElementById("quiz").innerHTML="Analyzing...";

 const res=await fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({answers:ans})
 });

 const data=await res.json();

 document.getElementById("dashboard").innerHTML="<h2>Top Careers</h2>";

 data.topCareers.forEach(c=>{
  const div=document.createElement("div");
  div.className="card";
  div.innerHTML=`
   <h3>${c.title} (${c.confidence}%)</h3>
   <p>${c.reason}</p>
   <ul>${c.roadmap.map(r=>`<li>${r}</li>`).join("")}</ul>
  `;
  document.getElementById("dashboard").appendChild(div);
 });
}
