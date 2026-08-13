import { NextResponse } from "next/server";
import { publishScheduledArticles } from "@/app/actions/articles";

export async function GET() {
  await publishScheduledArticles();

  return NextResponse.json({
    success: true,
  });
}