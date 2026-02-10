"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Calendar,
    Clock,
    ArrowRight,
    Search,
    X,
    Grid3x3,
    List,
    Heart,
    TrendingUp,
    Sparkles,
    Eye,
} from "lucide-react";

type Post = {
    id: string;
    slug: string;
    title: string;
    image: string | null;
    createdAt: Date;
    readingTime: number;
    content: any;
    likes: number;
    views?: number;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    gradient?: string | null;
};

type Props = {
    posts: Post[];
    categories: { id: string; name: string; slug: string }[];
};

type ViewMode = "grid" | "list";
type SortOption = "latest" | "popular" | "reading-time";

// Helper to extract excerpt from JSON content
function getExcerpt(content: any): string {
    if (Array.isArray(content)) {
        const firstParagraph = content.find(
            (block: any) => block.type === "paragraph"
        );
        return firstParagraph
            ? firstParagraph.content.slice(0, 150) + "..."
            : "Click to read more...";
    }
    return "Click to read more...";
}

// Category gradient mapping
const categoryGradients: Record<string, string> = {
    "Web Development": "from-blue-500 to-cyan-500",
    "System Design": "from-purple-500 to-pink-500",
    "AI & ML": "from-green-500 to-emerald-500",
    DevOps: "from-orange-500 to-red-500",
    Database: "from-indigo-500 to-blue-500",
    default: "from-pink-500 to-purple-500",
};

export default function BlogListingClient({ posts, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<SortOption>("latest");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // Filter and sort posts
    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.category.name.toLowerCase().includes(query) ||
                    getExcerpt(post.content).toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (post) => post.category.slug === selectedCategory
            );
        }

        // Sort posts
        const sorted = [...filtered];
        switch (sortBy) {
            case "latest":
                sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case "popular":
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case "reading-time":
                sorted.sort((a, b) => a.readingTime - b.readingTime);
                break;
        }

        return sorted;
    }, [posts, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="space-y-6 md:space-y-8 pb-20">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3 md:space-y-4 px-4"
            >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    All Blogs
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
                    Thoughts on software engineering, system design, and the future of AI.
                </p>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-2 md:top-4 z-10 bg-background/95 backdrop-blur-lg border border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg mx-2 md:mx-0"
            >
                <div className="space-y-3 md:space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 text-sm md:text-base bg-card border border-border rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        {/* Category Filters - Horizontal Scroll on Mobile */}
                        <div className="flex-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            <div className="flex items-center gap-2 min-w-max md:flex-wrap">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${selectedCategory === "all"
                                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30"
                                        : "bg-card border border-border hover:border-primary/50 text-foreground"
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.slug)}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${selectedCategory === category.slug
                                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30"
                                            : "bg-card border border-border hover:border-primary/50 text-foreground"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Popular</option>
                                <option value="reading-time">Reading Time</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex items-center gap-0.5 md:gap-1 bg-card border border-border rounded-lg p-0.5 md:p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 md:p-2 rounded transition-colors ${viewMode === "grid"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    title="Grid view"
                                    aria-label="Grid view"
                                >
                                    <Grid3x3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 md:p-2 rounded transition-colors ${viewMode === "list"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    title="List view"
                                    aria-label="List view"
                                >
                                    <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground px-4 md:px-0"
            >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>
                    Showing {filteredAndSortedPosts.length} of {posts.length} articles
                </span>
            </motion.div>

            {/* Posts Grid/List */}
            <AnimatePresence mode="wait">
                {filteredAndSortedPosts.length > 0 ? (
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={
                            viewMode === "grid"
                                ? "grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-0"
                                : "space-y-4 md:space-y-6 px-4 md:px-0"
                        }
                    >
                        {filteredAndSortedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {viewMode === "grid" ? (
                                    <GridCard post={post} />
                                ) : (
                                    <ListCard post={post} />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 md:py-20 space-y-4 px-4"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-foreground">
                            No articles found
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto px-4">
                            Try adjusting your search or filters to find what you're looking
                            for.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            className="px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Grid Card Component
function GridCard({ post }: { post: Post }) {
    const gradient =
        categoryGradients[post.category.name] || categoryGradients.default;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 h-full"
        >
            {/* Image Cover with Gradient Overlay */}
            <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden">
                {post.image ? (
                    <>
                        <img
                            src={post.image}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div
                            className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-40 group-hover:opacity-30 transition-opacity`}
                        />
                    </>
                ) : (
                    <div
                        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                        <Sparkles className="w-12 h-12 text-white/50" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span
                        className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs md:text-sm font-semibold shadow-lg backdrop-blur-sm`}
                    >
                        {post.category.name}
                    </span>
                </div>

                {/* Trending Badge for Popular Posts */}
                {post.likes > 5000 && (
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        <div className="flex items-center gap-1 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg">
                            <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            <span className="hidden sm:inline">Trending</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4 md:p-6">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-muted-foreground mb-2 md:mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="hidden sm:inline">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="sm:hidden">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {(post.likes / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views ? (post.views / 1000).toFixed(1) + 'k' : '0'}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all line-clamp-2">
                    {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-1">
                    {getExcerpt(post.content)}
                </p>

                {/* Read More Link */}
                <div className="flex items-center text-xs md:text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}

// List Card Component
function ListCard({ post }: { post: Post }) {
    const gradient =
        categoryGradients[post.category.name] || categoryGradients.default;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row gap-4 md:gap-6 rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1 p-4 md:p-6"
        >
            {/* Image */}
            <div className="relative w-full sm:w-48 md:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl">
                {post.image ? (
                    <>
                        <img
                            src={post.image}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div
                            className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-40 group-hover:opacity-30 transition-opacity`}
                        />
                    </>
                ) : (
                    <div
                        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                        <Sparkles className="w-12 h-12 text-white/50" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                    <span
                        className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-semibold shadow-lg`}
                    >
                        {post.category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-muted-foreground mb-2 md:mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="hidden sm:inline">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="sm:hidden">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime} min
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {(post.likes / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views ? (post.views / 1000).toFixed(1) + 'k' : '0'}
                        </span>
                        {post.likes > 5000 && (
                            <span className="flex items-center gap-1 text-amber-500">
                                <TrendingUp className="w-3 h-3" />
                                Trending
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all">
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 md:mb-4">
                        {getExcerpt(post.content)}
                    </p>
                </div>

                {/* Read More Link */}
                <div className="flex items-center text-xs md:text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
