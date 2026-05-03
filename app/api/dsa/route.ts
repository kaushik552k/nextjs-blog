import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // If only stats are requested
    const returnStats = searchParams.get("stats") === "true";
    if (returnStats) {
      const [total, easy, medium, hard] = await Promise.all([
        prisma.dsaQuestion.count(),
        prisma.dsaQuestion.count({ where: { difficulty: { equals: "Easy", mode: "insensitive" } } }),
        prisma.dsaQuestion.count({ where: { difficulty: { equals: "Medium", mode: "insensitive" } } }),
        prisma.dsaQuestion.count({ where: { difficulty: { equals: "Hard", mode: "insensitive" } } }),
      ]);
      return NextResponse.json({ total, easy, medium, hard });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const difficulty = searchParams.get("difficulty") || "All";
    const category = searchParams.get("category") || "All";

    // Build the filtering conditions
    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { contains: query, mode: "insensitive" } }
      ];
    }

    if (difficulty && difficulty !== "All") {
      whereClause.difficulty = { equals: difficulty, mode: "insensitive" };
    }

    if (category && category !== "All") {
      whereClause.categoryId = category;
    }

    // Fetch total matching count
    const totalCount = await prisma.dsaQuestion.count({ where: whereClause });

    // Fetch the data
    const dsaQuestions = await prisma.dsaQuestion.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        originalId: 'asc'
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: dsaQuestions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching DSA questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
