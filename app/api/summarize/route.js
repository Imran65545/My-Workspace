import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { content } = await req.json();

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Summarize this note: ${content}` }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return Response.json({ summary: summary || "⚠️ Gemini response missing." });
  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response("Gemini API error", { status: 500 });
  }
}
