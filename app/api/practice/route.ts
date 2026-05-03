import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const query = searchParams.get("query") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const category = searchParams.get("category") || "";
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      const [total, easy, medium, hard] = await Promise.all([
        prisma.question.count(),
        prisma.question.count({ where: { difficulty: { in: ["Easy", "easy"] } } }),
        prisma.question.count({ where: { difficulty: { in: ["Medium", "medium"] } } }),
        prisma.question.count({ where: { difficulty: { in: ["Hard", "hard"] } } }),
      ]);
      return NextResponse.json({ total, easy, medium, hard });
    }

    const whereClause: any = {};
    if (query) whereClause.title = { contains: query, mode: "insensitive" };
    if (difficulty && difficulty !== "All") {
      whereClause.difficulty = { in: [difficulty, difficulty.toLowerCase()] };
    }
    if (category && category !== "All") whereClause.categoryId = category;

    const [totalCount, questions] = await Promise.all([
      prisma.question.count({ where: whereClause }),
      prisma.question.findMany({
        where: whereClause,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: questions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching practice questions:", error);
    return NextResponse.json({ error: "Failed to fetch practice questions" }, { status: 500 });
  }
}
