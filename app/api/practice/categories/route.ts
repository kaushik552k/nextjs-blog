import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.questionCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch question categories" },
      { status: 500 }
    );
  }
}
