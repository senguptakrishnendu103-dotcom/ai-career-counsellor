const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const careers = {
  tech: {
    title: "Software Developer",
    reason: "You have strong logical and problem-solving skills.",
    roadmap: ["Learn coding", "Build projects", "DSA", "Internships"]
  },
  business: {
    title: "Business Manager",
    reason: "You show leadership and decision-making ability.",
    roadmap: ["Learn management", "Leadership skills", "Internships"]
  },
  creative: {
    title: "UI/UX Designer",
    reason: "You are creative and design-oriented.",
    roadmap: ["Learn Figma", "UX principles", "Portfolio"]
  },
  medical: {
    title: "Doctor",
    reason: "You like helping people and care deeply.",
    roadmap: ["NEET", "MBBS", "Internship"]
  },
  law: {
    title: "Lawyer",
    reason: "You enjoy arguments and logical reasoning.",
    roadmap: ["CLAT", "Law degree", "Practice"]
  },
  finance: {
    title: "Financial Analyst",
    reason: "You are good with numbers and analysis.",
    roadmap: ["Finance basics", "Excel", "Certifications"]
  },
  sports: {
    title: "Athlete",
    reason: "You enjoy physical activity and competition.",
    roadmap: ["Training", "Academy", "Competitions"]
  }
};

function generateCareerAdvice(user){
  const input=(user.answers||[]).join(" ").toLowerCase();

  let score={
    tech:0,business:0,creative:0,medical:0,law:0,finance:0,sports:0
  };

  if(input.includes("logical")) score.tech+=3;
  if(input.includes("leader")) score.business+=3;
  if(input.includes("creative")) score.creative+=3;
  if(input.includes("help")) score.medical+=3;
  if(input.includes("argue")) score.law+=3;
  if(input.includes("numbers")) score.finance+=3;
  if(input.includes("sports")) score.sports+=3;

  const sorted = Object.entries(score)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  const topCareers = sorted.map(([key,val])=>{
    return {
      title:careers[key].title,
      score:val,
      confidence: Math.min(95, 60 + val*10),
      reason: careers[key].reason,
      roadmap: careers[key].roadmap
    };
  });

  return { topCareers };
}

app.post("/api/career",(req,res)=>{
  res.json(generateCareerAdvice(req.body));
});

app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
app.post("/api/career",(req,res)=>{
  res.json(generateCareerAdvice(req.body));
});

app.listen(PORT,()=>console.log("Server running on http://localhost:3000"));
