import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@opendatalabs/connect-js/server";

const odl = createClient({
  apiBaseUrl: "https://api.opendatalabs.com/api/v1",
  apiKey: process.env.OPENDATALABS_API_KEY!,
  secret: process.env.OPENDATALABS_ENCRYPTION_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, scopes } = body;

    const session = await odl.createConnectSession({
      appId: process.env.OPENDATALABS_APP_ID,
      source: source ?? "oura",
      scopes: scopes ?? ["read:readiness", "read:sleep", "read:activity"],
      origin: process.env.NEXT_PUBLIC_APP_URL,
    });

    return NextResponse.json({
      connectUrl: session.connectUrl,
      connectionId: session.connectionId,
      connectToken: session.connectToken,
    });
  } catch (err) {
    console.error("[connect-session]", err);
    return NextResponse.json(
      { error: "Failed to create connect session" },
      { status: 500 },
    );
  }
}
