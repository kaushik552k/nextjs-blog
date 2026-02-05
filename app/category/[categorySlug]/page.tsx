import { notFound } from "next/navigation";
import CategoryView from "@/app/components/CategoryView";
import { getCategoryBySlug, getPostsByCategory } from "@/app/lib/data"; // New Import

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  // Fetch from DB
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  // Fetch posts from DB
  const posts = await getPostsByCategory(categorySlug);

  return (
    <CategoryView category={category} posts={posts} params={{ categorySlug }} />
  );
}
