import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function PATCH(request) {
  try {
    const { logId } = await request.json();

    if (!logId) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 });
    }

    const log = await prisma.wasteLog.update({
      where: { id: logId },
      data: {
        status: "ACCEPTED",
      }
    });

    return NextResponse.json({
      success: true,
      log
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
