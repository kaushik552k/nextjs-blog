"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Database, Code2, Brain } from "lucide-react";

const iconMap: any = { Database, Code2, Brain };

type Props = {
  categories: any[]; // We can use 'any' or the real Prisma type
};

const MainCategoriesSection = ({ categories }: Props) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Explore by Domain
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep-dive into specialized content organized by topic area
          </p>
        </motion.div>

        {/* Main Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon] || Code2;
            const remainingCount = Math.max(
              0,
              category.subcategories.length - 3,
            );

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group block h-full"
                >
                  <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all overflow-hidden">
                    {/* Hover Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                    />
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient}`}
                    />

                    <div className="relative">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>

                      {/* Subcategories Preview */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.subcategories.slice(0, 3).map((sub: any) => (
                          <span
                            key={sub.id}
                            className="px-2 py-1 rounded-md bg-background text-xs text-muted-foreground border border-border"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span className="px-2 py-1 rounded-md bg-background text-xs text-muted-foreground border border-border">
                            +{remainingCount} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {category._count.posts} articles
                        </span>
                        <motion.span
                          className="flex items-center gap-1 text-sm font-semibold text-pink-500"
                          whileHover={{ x: 4 }}
                        >
                          Explore <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* --- MISSING PART RESTORED BELOW --- */}

        {/* All Topics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-secondary/30 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            All Topics
          </h3>
          <AllTopicsGrid categories={categories} />
        </motion.div>
      </div>
    </section>
  );
};

// Separate component for all topics grid
const AllTopicsGrid = ({ categories }: { categories: any[] }) => {
  // Build flat list of all topics
  const allTopics = [];
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      allTopics.push({
        key: cat.slug + "-" + sub.slug,
        name: sub.name,
        slug: sub.slug,
        categorySlug: cat.slug,
        gradient: cat.gradient,
      });
    }
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {allTopics.map((topic) => (
        <TopicLink key={topic.key} topic={topic} />
      ))}
    </div>
  );
};

// Individual topic link component
const TopicLink = ({ topic }: any) => {
  return (
    <Link
      href={`/category/${topic.categorySlug}/${topic.slug}`}
      className="group flex items-center justify-between p-3 rounded-xl bg-card hover:bg-muted border border-border hover:border-primary/30 transition-all"
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full bg-gradient-to-r ${topic.gradient}`}
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {topic.name}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
};

export default MainCategoriesSection;
