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

// force-dynamic: render at request time (not at build time).
// The Postgres DB is only reachable inside the running Docker network,
// so we cannot pre-render this page during `next build`. ISR would try
// to hit the DB at build time and fail. force-dynamic is correct here.
// Performance is still improved vs before via: Next.js Image preloading
// (LCP fix), server-component layout (TBT fix), and nginx caching.
export const dynamic = "force-dynamic";


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
