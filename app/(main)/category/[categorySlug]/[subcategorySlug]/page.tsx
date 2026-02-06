import { notFound } from "next/navigation";
import CategoryView from "@/app/components/CategoryView";
import { getCategoryBySlug, getPostsBySubcategory } from "@/app/lib/data"; // New Import

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
};

export default async function SubCategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const currentSubcategory = category.subcategories?.find(
    (sub) => sub.slug === subcategorySlug,
  );

  if (!currentSubcategory) {
    notFound();
  }

  const posts = await getPostsBySubcategory(categorySlug, subcategorySlug);

  return (
    <CategoryView
      category={category}
      currentSubcategory={currentSubcategory}
      posts={posts}
      params={{ categorySlug, subcategorySlug }}
    />
  );
}
