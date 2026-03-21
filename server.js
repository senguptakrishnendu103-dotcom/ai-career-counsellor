const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// 🔥 BIGGER DATASET
const careers = {
  tech: {
    titles: ["Software Developer", "AI Engineer", "Web Developer"],
    reasons: [
      "You have strong logical thinking.",
      "You enjoy solving complex problems.",
      "You like structured systems."
    ],
    roadmap: [
      "Learn Programming (JS/Python)",
      "Build Real Projects",
      "Learn Data Structures",
      "Apply for internships"
    ]
  },
  business: {
    titles: ["Business Manager", "Entrepreneur", "Consultant"],
    reasons: [
      "You show leadership skills.",
      "You enjoy decision-making.",
      "You like managing people."
    ],
    roadmap: [
      "Learn business fundamentals",
      "Improve communication",
      "Do internships",
      "Start small projects"
    ]
  },
  creative: {
    titles: ["UI/UX Designer", "Graphic Designer", "Content Creator"],
    reasons: [
      "You are creative.",
      "You enjoy design and visuals.",
      "You think differently."
    ],
    roadmap: [
      "Learn design tools",
      "Build portfolio",
      "Freelance projects",
      "Apply for roles"
    ]
  },
  medical: {
    titles: ["Doctor", "Nurse", "Healthcare Specialist"],
    reasons: [
      "You like helping people.",
      "You care about others.",
      "You are empathetic."
    ],
    roadmap: [
      "Prepare for entrance exams",
      "Medical degree",
      "Internship",
      "Specialization"
    ]
  },
  law: {
    titles: ["Lawyer", "Legal Advisor"],
    reasons: [
      "You enjoy arguments.",
      "You think logically.",
      "You like debating."
    ],
    roadmap: [
      "Prepare for CLAT",
      "Law degree",
      "Internships",
      "Practice law"
    ]
  },
  finance: {
    titles: ["Financial Analyst", "Investment Banker"],
    reasons: [
      "You like numbers.",
      "You enjoy analysis.",
      "You think strategically."
    ],
    roadmap: [
      "Learn finance basics",
      "Excel & analytics",
      "Certifications",
      "Internships"
    ]
  }
};

// 🔥 RANDOMIZER (NO SAME RESPONSE)
function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

// 🔥 SMART AI
function generateAdvice(user){
  const input = (user.answers || []).join(" ").toLowerCase();

  let score = {
    tech:0,business:0,creative:0,medical:0,law:0,finance:0
  };

  if(input.includes("logical")) score.tech+=3;
  if(input.includes("leader")) score.business+=3;
  if(input.includes("creative")) score.creative+=3;
  if(input.includes("help")) score.medical+=3;
  if(input.includes("argue")) score.law+=3;
  if(input.includes("number")) score.finance+=3;

  const sorted = Object.entries(score)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  const result = sorted.map(([key,val])=>{
    const data = careers[key];

    return {
      title: random(data.titles),
      reason: random(data.reasons),
      confidence: Math.min(95, 60 + val*10),
      roadmap: data.roadmap
    };
  });

  return { topCareers: result };
}

app.post("/api/career",(req,res)=>{
  res.json(generateAdvice(req.body));
});

app.listen(PORT,()=>console.log("Server running"));
