import { notFound } from "next/navigation";
import BlogPostClient from "@/app/components/BlogPostClient";
import { getPostBySlug, getRelatedPosts } from "@/app/lib/data";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the Post from Postgres
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 2. Fetch Related Posts (using the category ID from the fetched post)
  const relatedPosts = await getRelatedPosts(post.categoryId, post.slug);

  // 3. Prepare data for the Client Component
  // In DB, content is stored directly on the post object as JSON
  const content = post.content;

  // Relations are already fetched via 'include', so we just access them
  const categoryName = post.category.name;
  const subcategoryName = post.subcategory?.name || "";

  return (
    <BlogPostClient
      post={post}
      content={content}
      categoryName={categoryName}
      subcategoryName={subcategoryName}
      relatedPosts={relatedPosts}
    />
  );
}
