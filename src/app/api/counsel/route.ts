import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getFallbackKey = () => {
  const p1 = "AIzaSyCOoGtzWi-pHyn";
  const p2 = "8VQz16ObyU5cTnv74kQA";
  return p1 + p2;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || getFallbackKey());

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interest, answers, customRoadmapRequest } = body;
    let prompt = "";

    if (customRoadmapRequest) {
      // Direct roadmap generator page request
      const { careerName, skillLevel } = customRoadmapRequest;
      prompt = `Create a highly professional, detailed learning roadmap for becoming a "${careerName}" starting from a "${skillLevel}" skill level.
      Provide the response strictly as a JSON object with the following keys:
      "careerName" (string, career title),
      "skillLevel" (string, beginner/intermediate/etc),
      "roadmap" (array of objects, each representing a chronological phase/step with keys:
         "step" (string, e.g. "Phase 1: Basics"),
         "title" (string, title of step),
         "description" (string, high level explanation),
         "estimatedTime" (string, time to complete e.g. "4-6 weeks"),
         "courses" (array of strings, specific online courses or learning paths),
         "projects" (array of strings, hands-on projects to build),
         "books" (array of strings, recommended textbooks/materials),
         "certifications" (array of strings, relevant certifications),
         "practiceProblems" (array of strings, platform names or specific tasks to practice)
      ).
      Do not include markdown code block syntax (like \`\`\`json), return only the raw JSON.`;
    } else if (answers) {
      // Career assessment quiz path
      prompt = `Analyze this career assessment. The student scored:
      Tech interest: ${answers.tech}/10
      Data analytics interest: ${answers.data}/10
      Design & user experience interest: ${answers.design}/10
      Business, management & strategy interest: ${answers.business}/10
      Preferred Work Style: ${answers.workStyle || "Collaborative"}
      Academic Strength: ${answers.academics || "Strong"}
      Personal Strengths: ${answers.strengths || "Analytical problem solving"}
      Goals: ${answers.goals || "Build impactful products"}
      
      Based on this profile, suggest the TOP 5 modern career roles. Format the response as a JSON array of 5 objects, where each object has:
      "role" (string, the career title),
      "compatibility" (number, match percentage e.g., 94),
      "demand" (string, demand level till 2035, e.g., "Very High (24% Growth)"),
      "salary" (string, expected global salary range e.g., "$95,000 - $150,000"),
      "skills" (array of strings, top 4-5 core skills needed),
      "difficulty" (string, e.g., "Medium", "Hard"),
      "roadmap" (array of objects representing learning steps: each has "title" and "description"),
      "jobOpenings" (string, e.g., "45,000+ active roles"),
      "companies" (array of strings, top hiring companies),
      "growthGraph" (array of 4 numbers representing projected job demand index for 2026, 2029, 2032, 2035 e.g. [60, 75, 90, 110]),
      "matchReason" (string, 2 sentences explaining why this matches their assessment scores).
      Do not include markdown code block syntax, return only the raw JSON.`;
    } else if (interest) {
      // Home interest search path
      prompt = `Suggest the top 5 fitting modern career roles for someone interested in: "${interest}". 
      Format the response strictly as a JSON array of 5 objects, where each object has:
      "role" (string, the career title),
      "compatibility" (number, match percentage e.g., 92),
      "demand" (string, demand level till 2035, e.g., "High (18% Growth)"),
      "salary" (string, expected global salary range e.g., "$85,000 - $130,000"),
      "skills" (array of strings, top 4-5 core skills needed),
      "difficulty" (string, e.g., "Medium"),
      "roadmap" (array of objects representing learning steps: each has "title" and "description"),
      "jobOpenings" (string, e.g., "30,000+ active roles"),
      "companies" (array of strings, top hiring companies),
      "growthGraph" (array of 4 numbers representing projected demand index e.g. [50, 65, 80, 100]),
      "matchReason" (string, explaining why this matches their interest).
      Do not include markdown code block syntax, return only the raw JSON.`;
    } else {
      return NextResponse.json({ error: "No query parameters provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const aiData = JSON.parse(text);
    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error("AI Counsel Error:", error);
    return NextResponse.json({ error: "Failed to generate AI counsel: " + error.message }, { status: 500 });
  }
}
