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

function findCareer(){
 const interest = document.getElementById("interest").value;

 fetch("/api/career",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({interest})
 })
 .then(r=>r.json())
 .then(d=>{
   const results = document.getElementById("results");
   results.innerHTML="";

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
 });
}
