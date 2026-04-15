import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@opendatalabs/connect-js/server";
import Anthropic from "@anthropic-ai/sdk";

const odl = createClient({
  apiBaseUrl: "https://api.opendatalabs.com/api/v1",
  apiKey: process.env.OPENDATALABS_API_KEY!,
  secret: process.env.OPENDATALABS_ENCRYPTION_SECRET!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are a sleep recovery coach with expertise in HRV, sleep architecture, and recovery science. You have access to the user's real Oura Ring data. Generate a personalised nightly recovery plan for tonight. Be specific — reference actual scores, HRV values, sleep duration, and readiness numbers from their data. Give 3-4 concrete recommendations. Each recommendation has: a short title, a 2-3 sentence explanation that cites their actual metrics, and one specific action to take tonight. End with a single 'Tonight's priority' — one sentence. No generic wellness advice. No em-dashes. No bullet walls.

Respond ONLY with valid JSON in this exact shape:
{
  "priority": "one sentence",
  "recommendations": [
    {
      "title": "short title",
      "explanation": "2-3 sentences citing actual metrics",
      "action": "one specific action for tonight"
    }
  ]
}`;

export async function GET(request: NextRequest) {
  const connectionId = request.nextUrl.searchParams.get("connectionId");

  if (!connectionId) {
    return NextResponse.json(
      { error: "connectionId is required" },
      { status: 400 },
    );
  }

  try {
    const result = await odl.fetchConnectionResult(connectionId);
    const data = result.data as {
      "oura.readiness"?: {
        days: { day: string; score: number; temperatureDeviation: number }[];
      };
      "oura.sleep"?: {
        dailyScores: { day: string; score: number }[];
        sleepPeriods: {
          day: string;
          type: string;
          bedtimeStart: string;
          bedtimeEnd: string;
          totalSleepDuration: number;
          efficiency: number;
          averageHeartRate: number;
          averageHrv: number;
        }[];
      };
      "oura.activity"?: {
        days: {
          day: string;
          score: number;
          steps: number;
          activeCalories: number;
          totalCalories: number;
          highActivityTime: number;
        }[];
      };
    };

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the user's Oura Ring data:\n\n${JSON.stringify(data, null, 2)}\n\nGenerate their personalised recovery plan for tonight.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Claude returned unexpected format");
    }

    const plan = JSON.parse(jsonMatch[0]);
    return NextResponse.json(plan);
  } catch (err) {
    console.error("[result]", err);
    return NextResponse.json(
      { error: "Failed to generate recovery plan" },
      { status: 500 },
    );
  }
}
