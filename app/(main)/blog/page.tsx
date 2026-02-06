import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Helper to calculate reading time from JSON blocks if not saved in DB
// (Optional since we now save it, but good fallback)
function getExcerpt(content: any) {
  if (Array.isArray(content)) {
    const firstParagraph = content.find(
      (block: any) => block.type === "paragraph",
    );
    return firstParagraph
      ? firstParagraph.content.slice(0, 150) + "..."
      : "Click to read more...";
  }
  return "Click to read more...";
}

export default async function BlogPage() {
  // 1. Fetch Published Posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { category: true }, // Include category if you have one linked
  });

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          The Blog
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Thoughts on software engineering, system design, and the future of AI.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
          >
            {/* Image Cover */}
            {post.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime} min read
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {/* We safely extract a string from the JSON content */}
                {getExcerpt(post.content)}
              </p>

              <div className="flex items-center text-sm font-medium text-primary">
                Read Article <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No posts found. Go to Admin to publish one!
        </div>
      )}
    </div>
  );
}
