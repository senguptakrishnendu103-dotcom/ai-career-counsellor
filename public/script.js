const questions=[
"Do you like logical thinking?",
"Do you enjoy leadership?",
"Are you creative?",
"Do you like working with numbers?"
];

let i=0;
let answers=[];

function addMessage(text,type){
 const msg=document.createElement("div");
 msg.className="message "+type;
 msg.innerText=text;
 document.getElementById("chatBox").appendChild(msg);
 msg.scrollIntoView();
}

// visitors
fetch("/api/visit")
.then(r=>r.json())
.then(d=>{
 document.getElementById("visitor").innerText=
 `👀 ${d.visitors} users visited`;
});

function startQuiz(){
 i=0;
 answers=[];
 document.getElementById("chatBox").innerHTML="";
 ask();
}

function ask(){
 if(i>=questions.length) return submit();

 addMessage(questions[i],"ai");

 const options=document.createElement("div");
 options.className="options";

 options.innerHTML=`
   <button onclick="answer('Yes')">Yes</button>
   <button onclick="answer('No')">No</button>
 `;

 document.getElementById("chatBox").appendChild(options);
}

function answer(a){
 addMessage(a,"user");
 answers.push(a+" "+questions[i]);
 i++;
 ask();
}

async function submit(){
 addMessage("Analyzing your profile...","ai");

 const res=await fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({answers})
 });

 const data=await res.json();

 addMessage(data.explanation,"ai");

 data.topCareers.forEach(c=>{
   addMessage(`${c.title} (${c.confidence}%)`,"ai");
 });
}
