import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const filter = searchParams.get("filter") || "all";
        const take = 20;
        const skip = (page - 1) * take;

        // Calculate date filter based on selected filter
        const now = new Date();
        let dateFilter = {};

        if (filter === "today") {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            dateFilter = { publishedAt: { gte: today } };
        } else if (filter === "week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = { publishedAt: { gte: weekAgo } };
        } else if (filter === "month") {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = { publishedAt: { gte: monthAgo } };
        }

        // Fetch posts with filter
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                ...dateFilter,
            },
            orderBy: { publishedAt: "desc" },
            take,
            skip,
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                image: true,
                publishedAt: true,
                readingTime: true,
                views: true,
                likes: true,
                category: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
                tags: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json({
            posts,
            hasMore: posts.length === take,
        });
    } catch (error) {
        console.error("Error fetching latest posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
