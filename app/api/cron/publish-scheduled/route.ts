import { NextResponse } from "next/server";
import { publishScheduledArticles } from "@/app/actions/articles";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  await publishScheduledArticles();

  return NextResponse.json({
    success: true,
  });
}