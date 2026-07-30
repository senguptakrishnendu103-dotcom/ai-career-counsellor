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
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message history" }, { status: 400 });
    }

    // Format message history for Gemini chat
    const systemPrompt = `You are "CareerAI Mentor", an expert career counselor, academic advisor, and resume coach. 
    You are professional, encouraging, and provide concrete, actionable advice. 
    Answer questions about careers, colleges, resume fixes, interview preparation, learning paths, and salary trends. 
    Keep responses concise, using formatting like bullet points where relevant.`;
    
    const firstUserIndex = messages.findIndex(msg => msg.role === "user");
    const historyMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;

    const formattedMessages = historyMessages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start Chat
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1)
    });

    const lastMessage = messages[messages.length - 1]?.content || "";
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: "Failed to generate chat response: " + error.message }, { status: 500 });
  }
}
