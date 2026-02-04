import { notFound } from "next/navigation";
import { getCategoryBySlug, getPostsBySubcategory } from "@/app/data/mock";
import CategoryView from "@/app/components/CategoryView";

type Props = {
  params: {
    categorySlug: string;
    subcategorySlug: string;
  };
};

export default async function SubCategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const currentSubcategory = category.subcategories?.find(
    (sub) => sub.slug === subcategorySlug,
  );

  if (!currentSubcategory) {
    notFound();
  }

  const posts = getPostsBySubcategory(categorySlug, subcategorySlug);

  return (
    <CategoryView
      category={category}
      currentSubcategory={currentSubcategory}
      posts={posts}
      params={{ categorySlug, subcategorySlug }}
    />
  );
}
