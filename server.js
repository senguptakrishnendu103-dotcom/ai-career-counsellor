const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let visitors = 0;

const careerData = [
  { role: "AI Engineer", salary: "₹12L - ₹30L", demand: "Very High" },
  { role: "Software Developer", salary: "₹6L - ₹20L", demand: "High" },
  { role: "Data Scientist", salary: "₹10L - ₹25L", demand: "Very High" },
  { role: "Cybersecurity Analyst", salary: "₹8L - ₹18L", demand: "High" },
  { role: "Cloud Engineer", salary: "₹10L - ₹22L", demand: "Very High" }
];

app.get("/api/data", (req, res) => {
  visitors++;
  res.json({
    visitors,
    skills: [
      "AI/ML", "React", "Node.js", "Cloud", "Cybersecurity",
      "Data Science", "Blockchain", "DevOps"
    ],
    careers: careerData
  });
});

app.post("/api/career", (req, res) => {
  const { interest } = req.body;

  let filtered = careerData.filter(c =>
    c.role.toLowerCase().includes(interest.toLowerCase())
  );

  if (filtered.length === 0) filtered = careerData;

  res.json({
    message: "Based on your interest:",
    careers: filtered
  });
});

app.listen(PORT, () => console.log("Server running"));
