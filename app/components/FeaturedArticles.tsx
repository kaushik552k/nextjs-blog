"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Heart, ChevronDown } from "lucide-react";

// Define the shape of data we expect from the parent
type Props = {
  featuredPosts: any[];
  latestPosts: any[];
};

const FeaturedArticles = ({ featuredPosts, latestPosts }: Props) => {
  const [showAll, setShowAll] = useState(false);

  // Logic to toggle between showing 6 or all latest posts
  const displayedPosts = showAll ? latestPosts : latestPosts.slice(0, 6);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Hand-picked tutorials and deep-dives to help you level up
          </p>
        </motion.div>

        {/* Featured Posts - Large Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {featuredPosts.slice(0, 2).map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div
                  className={`relative h-full min-h-[320px] p-8 rounded-2xl bg-gradient-to-br ${post.gradient} overflow-hidden`}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end">
                    {/* Category Badge - Now using post.category.name directly */}
                    <span className="absolute top-0 left-0 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                      {post.category.name}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {post.title}
                    </h3>

                    {post.subtitle && (
                      <p className="text-white/80 font-medium mb-3">
                        {post.subtitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {(post.likes / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Latest Articles Grid */}
        <h3 className="text-2xl font-bold text-foreground mb-8">
          Latest Articles
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    {/* Category Badge - Using post.category.name */}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r ${post.gradient} text-white`}
                    >
                      {post.category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.readingTime} min
                    </span>
                  </div>

                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h4>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Show More Button */}
        {latestPosts.length > 6 && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAll ? "Show less" : "Show more articles"}
              <motion.div animate={{ rotate: showAll ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArticles;
