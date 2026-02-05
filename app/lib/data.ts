import { prisma } from "@/app/lib/prisma";
import { cache } from "react";

// 1. Fetch Categories with Subcategories (For MainCategoriesSection)
export const getCategories = cache(async () => {
  return await prisma.category.findMany({
    include: {
      subcategories: true,
      _count: {
        // <--- Add this magic section
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
});

// 2. Fetch Featured Posts (For FeaturedArticles)
export const getFeaturedPosts = cache(async () => {
  return await prisma.post.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    take: 2, // We only show 2 big cards
    orderBy: { publishedAt: "desc" },
  });
});

// 3. Fetch Latest Non-Featured Posts (For "Latest Articles" grid)
export const getLatestPosts = cache(async () => {
  return await prisma.post.findMany({
    where: { published: true, featured: false },
    include: { category: true },
    take: 6,
    orderBy: { publishedAt: "desc" },
  });
});

// 4. Fetch Popular Posts (For PopularSection)
export const getPopularPosts = cache(async () => {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { likes: "desc" }, // Order by most likes
    take: 4,
    include: { category: true },
  });
});

// 5. Fetch Category by Slug (For Category Pages)
export const getCategoryBySlug = cache(async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: { subcategories: true },
  });
});

// 6. Fetch Posts by Category Slug
export const getPostsByCategory = cache(async (slug: string) => {
  return await prisma.post.findMany({
    where: {
      published: true,
      category: { slug },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
});

// 7. Fetch Posts by SubCategory Slug
export const getPostsBySubcategory = cache(
  async (catSlug: string, subSlug: string) => {
    return await prisma.post.findMany({
      where: {
        published: true,
        category: { slug: catSlug },
        subcategory: { slug: subSlug },
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });
  },
);

// 8. Fetch Single Post by Slug (For Blog Post Page)
export const getPostBySlug = cache(async (slug: string) => {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategory: true,
      author: true,
      tags: true, // Assuming you have tags
    },
  });
});

// 9. Fetch Related Posts (Same Category, excluding current)
export const getRelatedPosts = cache(
  async (categoryId: string, currentSlug: string) => {
    return await prisma.post.findMany({
      where: {
        categoryId, // Match the same category ID
        slug: { not: currentSlug }, // Don't show the current post again
        published: true,
      },
      include: { category: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  },
);
