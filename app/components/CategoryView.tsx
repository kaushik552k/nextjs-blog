'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Database, Code2, Brain, Sparkles, Clock } from 'lucide-react';

// Map icon strings to actual components
const iconMap: any = {
  Database: Database,
  Code2: Code2,
  Brain: Brain
};

type Props = {
  category: any;
  currentSubcategory?: any;
  posts: any[];
  params: { categorySlug: string; subcategorySlug?: string };
};

const CategoryView = ({ category, currentSubcategory, posts, params }: Props) => {
  const { categorySlug, subcategorySlug } = params;
  const IconComponent = iconMap[category.icon] || Sparkles;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/category/${categorySlug}`}
            className={`hover:text-pink-500 transition-colors ${!subcategorySlug ? 'text-foreground font-medium' : ''}`}
          >
            {category.name}
          </Link>
          {currentSubcategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{currentSubcategory.name}</span>
            </>
          )}
        </motion.nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {currentSubcategory ? currentSubcategory.name : category.name}
              </h1>
              {!currentSubcategory && (
                <p className="text-muted-foreground mt-1 text-lg">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </motion.header>

        {/* Subcategories (Only show on main category page) */}
        {!subcategorySlug && category.subcategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Browse by Topic
            </h2>
            <div className="flex flex-wrap gap-3">
              {category.subcategories.map((sub: any, index: number) => (
                <motion.div
                  key={sub.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/category/${categorySlug}/${sub.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-pink-500/50 text-muted-foreground hover:text-pink-500 transition-all"
                  >
                    {sub.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border border-dashed">
              <p className="text-muted-foreground">No posts in this category yet.</p>
            </div>
          ) : (
            posts.map((post: any, index: number) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-pink-500/30 transition-all overflow-hidden">
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-pink-500 transition-colors mb-2">
                        {post.title}
                      </h2>

                      {post.subtitle && (
                        <p className="text-pink-500 font-medium mb-3">
                          {post.subtitle}
                        </p>
                      )}

                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {post.readingTime}
                        </span>

                        <motion.span
                          className="flex items-center gap-2 text-pink-500 font-semibold"
                          whileHover={{ x: 4 }}
                        >
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryView;