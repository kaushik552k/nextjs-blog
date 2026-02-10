import { prisma } from "@/app/lib/prisma";
import BlogListingClient from "@/app/components/BlogListingClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  // Fetch published posts and all categories
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return <BlogListingClient posts={posts} categories={categories} />;
}
