import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  userLocation?: string;
  date?: string;
}

const SYSTEM_PROMPT = `You are AstroGuide, an AI companion for the Cosmos Voyages platform — a premium astro-tourism platform that helps people discover stargazing locations, observatories, dark-sky destinations, space events, and cosmic experiences worldwide.

Your role:
- Help users find the best stargazing locations for their needs, location, and date
- Recommend telescopes, binoculars, and astrophotography gear
- Explain what's visible in the night sky tonight (planets, constellations, meteor showers, ISS passes, aurora)
- Plan stargazing trips and weekend getaways
- Recommend specific experiences, observatories, dark-sky parks, and space museums
- Explain astronomical concepts in simple, inspiring language
- Suggest viewing locations for upcoming eclipses, meteor showers, and aurora windows

Tone:
- Warm, knowledgeable, enthusiastic about the cosmos
- Practical and actionable — give specific recommendations
- Concise but complete; structure longer answers with bullet points
- Use cosmic imagery sparingly but inspiringly
- If asked something outside astronomy/stargazing, gently redirect to cosmic topics

Knowledge base includes curated destinations like:
- Atacama Desert (Chile) — best overall dark sky, ALMA observatory
- Mauna Kea Summit (Hawaii) — world's largest observatory complex
- Cherry Springs State Park (Pennsylvania) — best dark sky on US East Coast
- Teide National Park (Tenerife) — above the clouds
- Kiruna Aurora Village (Sweden) — prime Northern Lights location
- NamibRand Reserve (Namibia) — Africa's first Dark Sky Reserve
- Kennedy Space Center (Florida) — rocket launches
- Jodrell Bank (UK) — UNESCO radio observatory

Keep responses under 200 words when possible. Use markdown formatting for readability.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, userLocation, date } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const contextPrefix = userLocation
      ? `\n\nContext: User is currently near ${userLocation}${date ? ` on ${date}` : ""}. Tailor location-based recommendations to this area when possible.`
      : "";

    const fullMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT + contextPrefix },
      ...messages.filter((m) => m.role === "user" || m.role === "assistant").slice(-8),
    ];

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 600,
      model: "glm-4.6",
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I'm here to help you explore the cosmos. What would you like to know?";

    return NextResponse.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("AstroGuide chat error:", err);
    return NextResponse.json(
      { error: "Cosmic interference detected. Please try again.", detail: err?.message },
      { status: 500 }
    );
  }
}
