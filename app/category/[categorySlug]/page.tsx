import { notFound } from "next/navigation";
import { getCategoryBySlug, getPostsByCategory } from "@/app/data/mock";
import CategoryView from "@/app/components/CategoryView";

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(categorySlug);

  return (
    <CategoryView category={category} posts={posts} params={{ categorySlug }} />
  );
}
