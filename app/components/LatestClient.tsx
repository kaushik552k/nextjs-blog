"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";
import TimelineView from "@/app/components/TimelineView";
import FilterChips from "@/app/components/FilterChips";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

type Filter = "today" | "week" | "month" | "all";

type Post = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;
    publishedAt: Date;
    readingTime: number;
    views?: number;
    likes: number;
    category: {
        name: string;
        slug: string;
    };
    tags?: { name: string }[];
};

interface LatestClientProps {
    initialPosts: Post[];
    counts: {
        today: number;
        week: number;
        month: number;
        all: number;
    };
}

export default function LatestClient({ initialPosts, counts }: LatestClientProps) {
    const [filter, setFilter] = useState<Filter>("all");
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Reset when filter changes
    useEffect(() => {
        setPosts(initialPosts);
        setPage(1);
        setHasMore(true);
    }, [filter, initialPosts]);

    // Load more posts
    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/posts/latest?page=${page + 1}&filter=${filter}`
            );
            const data = await response.json();

            if (data.posts && data.posts.length > 0) {
                setPosts((prev) => [...prev, ...data.posts]);
                setPage((prev) => prev + 1);
                setHasMore(data.hasMore);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Infinite scroll hook
    const { loadMoreRef } = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
        loading,
    });

    // Show/hide scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen py-12 md:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Latest Posts
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Stay up to date with the newest content
                    </p>
                </motion.div>

                {/* Filter Chips */}
                <FilterChips
                    activeFilter={filter}
                    onFilterChange={setFilter}
                    counts={counts}
                />

                {/* Timeline View */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TimelineView posts={posts} />
                    </motion.div>
                </AnimatePresence>

                {/* Loading indicator */}
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                    {loading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading more posts...</span>
                        </div>
                    )}
                    {!hasMore && posts.length > 0 && (
                        <p className="text-muted-foreground text-center">
                            You've reached the end! 🎉
                        </p>
                    )}
                    {posts.length === 0 && (
                        <p className="text-muted-foreground text-center">
                            No posts found for this time period.
                        </p>
                    )}
                </div>
            </div>

            {/* Scroll to top button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all z-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
