import { notFound } from "next/navigation";
import { getPostBySlug, getCategoryBySlug, blogPosts } from "@/app/data/mock";
import blogContent from "@/app/data/blogContent"; // Ensure this path is correct
import BlogPostClient from "@/app/components/BlogPostClient";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params; // Await params in Next.js 15+
  const post = getPostBySlug(slug);
  const content = blogContent[slug];

  if (!post) {
    notFound();
  }

  const category = getCategoryBySlug(post.category);
  const categoryName = category ? category.name : post.category;

  // Subcategory logic
  let subcategoryName = "";
  if (category && category.subcategories) {
    const sub = category.subcategories.find(
      (s: any) => s.slug === post.subcategory,
    );
    if (sub) subcategoryName = sub.name;
  }

  // Related posts logic
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

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
