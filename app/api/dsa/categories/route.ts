import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.dsaCategory.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch DSA categories:", error);
    return NextResponse.json({ error: "Failed to fetch DSA categories" }, { status: 500 });
  }
}
