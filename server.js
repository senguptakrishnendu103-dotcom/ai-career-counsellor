const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Bigger dataset
const careers = {
  tech: {
    titles: ["Software Developer", "AI Engineer", "Full Stack Developer"],
    reasons: [
      "You show strong logical thinking.",
      "You enjoy solving complex problems.",
      "You like structured systems."
    ],
    roadmap: ["Learn coding", "Build projects", "DSA", "Internships"]
  },
  business: {
    titles: ["Entrepreneur", "Business Manager", "Consultant"],
    reasons: [
      "You show leadership skills.",
      "You enjoy decision-making.",
      "You like managing people."
    ],
    roadmap: ["Business basics", "Communication", "Internships"]
  },
  creative: {
    titles: ["UI/UX Designer", "Content Creator"],
    reasons: [
      "You are creative.",
      "You enjoy visuals.",
      "You think differently."
    ],
    roadmap: ["Design tools", "Portfolio", "Freelancing"]
  }
};

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function generateAdvice(user){
  const input = (user.answers||[]).join(" ").toLowerCase();

  let score={tech:0,business:0,creative:0};

  if(input.includes("logical")) score.tech+=3;
  if(input.includes("leader")) score.business+=3;
  if(input.includes("creative")) score.creative+=3;

  const sorted = Object.entries(score)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  const result = sorted.map(([key,val])=>{
    return {
      title: random(careers[key].titles),
      reason: random(careers[key].reasons),
      confidence: Math.min(95,60+val*10),
      roadmap: careers[key].roadmap
    };
  });

  return { topCareers: result };
}

app.post("/api/career",(req,res)=>{
  res.json(generateAdvice(req.body));
});

app.listen(PORT,()=>console.log("Server running"));
