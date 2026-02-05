import HeroSection from "@/app/components/HeroSection";
import MainCategoriesSection from "@/app/components/MainCategoriesSection";
import FeaturedArticles from "@/app/components/FeaturedArticles";
import PopularSection from "@/app/components/PopularSection";
import {
  getCategories,
  getFeaturedPosts,
  getLatestPosts,
  getPopularPosts,
} from "@/app/lib/data";

export default async function Home() {
  // 1. Parallel Fetching for performance
  const [categories, featuredPosts, latestPosts, popularPosts] =
    await Promise.all([
      getCategories(),
      getFeaturedPosts(),
      getLatestPosts(),
      getPopularPosts(),
    ]);

  return (
    <div className="flex flex-col">
      {/* HeroSection uses siteConfig (static), so we can leave it as is 
         OR pass the User data if you want it dynamic later.
      */}
      <HeroSection />

      {/* Pass Real Data */}
      <MainCategoriesSection categories={categories} />

      <FeaturedArticles
        featuredPosts={featuredPosts}
        latestPosts={latestPosts}
      />

      <PopularSection popularPosts={popularPosts} />
    </div>
  );
}
