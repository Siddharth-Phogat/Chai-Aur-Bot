import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERSONAS } from "@/app/data/personas"; // import personas
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

export async function POST(req) {
  try {
    const { prompt, personaIds = [], temperature = 0.7 } = await req.json();

    const selectedPersonas = personaIds.map((id) => PERSONAS[id]).filter(Boolean);
    const sanitizedPersonas = selectedPersonas.map(p => {
      const { greet, ...rest } = p; // exclude greet
      return rest;
    });

    // System prompt
    let systemContext = "";
    if (sanitizedPersonas.length) {
      systemContext = `
        You are an AI assistant adopting the persona(s) of the following characters:
        ${JSON.stringify(sanitizedPersonas, null, 2)}
            
        Instructions:
        - Respond according to their toneAndStyle, coreTeachingPrinciples, engagementAndHumor, examplePhrases, recentXActivity, bio, and avatar.
        - If Hitesh Choudhary is selected, answer in a friendly, engaging, project-oriented manner using Hinglish, motivational guidance, humor, and relatable analogies.
        - If Piyush Garg is selected, answer in a practical, high-energy, project-focused style using Hinglish-English mix (mostly hinglish), emojis, and actionable coding advice.
        - Encourage learners to implement projects, build confidence, and focus on real-world coding practices.
        - Maintain conversational and precise responses, avoid formal or robotic language.
        - Include emojis and cultural references where appropriate.
        - If Piyush Garg is selected, don't use greetings in responses.
      `;
    }

    const result = await model.generateContent(`${systemContext}\nUser: ${prompt}`, {
      temperature
    });

    const text = await result.response.text();
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error generating Gemini AI response:", err);
    return NextResponse.json({ text: "⚠️ Sorry, something went wrong. Please try again!" });
  }
}