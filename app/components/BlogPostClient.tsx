"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import LikeButton from "@/app/components/LikeButton";
import MDXRenderer from "@/app/components/MDXRenderer"; // ✅ Import the renderer

export default function BlogPostClient({
  post,
  content,
  categoryName,
  subcategoryName,
  relatedPosts,
}: any) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/category/${post.category}`}
          className="hover:text-primary transition-colors"
        >
          {categoryName}
        </Link>
        {subcategoryName && (
          <>
            <span>/</span>
            <span className="text-foreground">{subcategoryName}</span>
          </>
        )}
      </motion.nav>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl sm:text-2xl text-muted-foreground mb-6">
            {post.subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {post.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime}
          </span>
        </div>
      </motion.header>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags?.map((tag: string) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-card border border-border text-sm text-muted-foreground"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* ✅ FIXED: Content Renderer */}
      <div className="prose prose-invert max-w-none">
        {/* We pass content.content because your mock data structure has the array inside a 'content' key */}
        <MDXRenderer content={content?.content || []} />
      </div>

      {/* Like Section */}
      <div className="mt-16 py-12 border-t border-b border-border flex flex-col items-center">
        {/* ✅ FIXED: Changed 'slug' to 'postSlug' */}
        <LikeButton postSlug={post.slug} />
      </div>

      {/* Related Posts */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          More from {categoryName}
        </h2>
        <div className="space-y-4">
          {relatedPosts.map((p: any) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
