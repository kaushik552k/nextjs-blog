import { prisma } from "@/app/lib/prisma";
import LatestClient from "@/app/components/LatestClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Latest Posts | Your Blog",
    description: "Stay up to date with the newest blog posts and articles. Browse our timeline of latest content.",
};

export const dynamic = "force-dynamic";

export default async function LatestPage() {
    // Fetch initial posts (all time, first 20)
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 20,
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

    // Calculate counts for each filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [todayCount, weekCount, monthCount, allCount] = await Promise.all([
        prisma.post.count({
            where: { published: true, publishedAt: { gte: today } },
        }),
        prisma.post.count({
            where: { published: true, publishedAt: { gte: weekAgo } },
        }),
        prisma.post.count({
            where: { published: true, publishedAt: { gte: monthAgo } },
        }),
        prisma.post.count({
            where: { published: true },
        }),
    ]);

    const counts = {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        all: allCount,
    };

    return <LatestClient initialPosts={posts as any} counts={counts} />;
}
