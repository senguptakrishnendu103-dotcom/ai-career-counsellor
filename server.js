const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = 3000;

// Explanation
function generateExplanation(score) {
  let text = "🧠 AI Analysis:\n\n";

  Object.entries(score)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .forEach(([d])=>{
      if(d==="tech") text+="⚡ Strong logical thinking\n";
      if(d==="business") text+="💼 Leadership mindset\n";
      if(d==="creative") text+="🎨 Creative skills\n";
      if(d==="medical") text+="🩺 Helping nature\n";
      if(d==="law") text+="⚖️ Argument & reasoning\n";
      if(d==="finance") text+="💰 Number handling\n";
      if(d==="sports") text+="🏃 Active personality\n";
    });

  text += "\n📈 Suggestions:\n- Focus on top skills\n- Build projects";

  return text;
}

// AI
function generateCareerAdvice(user){
  const input=(user.answers||[]).join(" ").toLowerCase();

  let score={
    tech:0,business:0,creative:0,medical:0,law:0,finance:0,sports:0
  };

  if(input.includes("logic")) score.tech+=3;
  if(input.includes("leader")) score.business+=3;
  if(input.includes("creative")) score.creative+=3;
  if(input.includes("help")) score.medical+=3;
  if(input.includes("argue")) score.law+=3;
  if(input.includes("numbers")) score.finance+=3;
  if(input.includes("physical")) score.sports+=3;

  const sorted=Object.entries(score)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  const ranking=sorted.map((x,i)=>`#${i+1} → ${x[0]} (${x[1]})`).join("\n");

  return {
    ranking,
    scores:score,
    explanation:generateExplanation(score)
  };
}

app.post("/api/career",(req,res)=>{
  res.json(generateCareerAdvice(req.body));
});

app.listen(PORT,()=>console.log("Server running on http://localhost:3000"));