import HeroSection from "@/app/components/HeroSection";
import MainCategoriesSection from "@/app/components/MainCategoriesSection";
import FeaturedArticles from "@/app/components/FeaturedArticles";
import PopularSection from "@/app/components/PopularSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. The Hero (Intro & Avatar) */}
      <HeroSection />

      {/* 2. The Domain Explorer (Database, Code, etc.) */}
      <MainCategoriesSection />

      {/* 3. Featured & Latest Posts */}
      <FeaturedArticles />

      {/* 4. Top Ranked Content */}
      <PopularSection />
    </div>
  );
}
