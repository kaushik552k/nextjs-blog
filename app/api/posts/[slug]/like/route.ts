import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Increment like count atomically and return updated count
        const post = await prisma.post.update({
            where: { slug },
            data: { likes: { increment: 1 } },
            select: { likes: true },
        });

        return NextResponse.json({ likes: post.likes });
    } catch (error) {
        console.error("Error incrementing likes:", error);
        return NextResponse.json(
            { error: "Failed to increment likes" },
            { status: 500 }
        );
    }
}
