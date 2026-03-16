import { getAccountBalance } from "@/lib/hedera";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const balance = await getAccountBalance();
    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
