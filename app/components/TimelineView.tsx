"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Eye, Heart, Tag } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

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

interface TimelineViewProps {
    posts: Post[];
}

export default function TimelineView({ posts }: TimelineViewProps) {
    // Group posts by date
    const groupedPosts = groupPostsByDate(posts);

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-transparent" />

            <div className="space-y-12">
                {Object.entries(groupedPosts).map(([dateLabel, datePosts]) => (
                    <DateGroup
                        key={dateLabel}
                        dateLabel={dateLabel}
                        posts={datePosts}
                    />
                ))}
            </div>
        </div>
    );
}

function DateGroup({ dateLabel, posts }: { dateLabel: string; posts: Post[] }) {
    return (
        <div className="relative">
            {/* Date marker */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative z-10 flex items-center justify-center w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {dateLabel}
                </h2>
            </div>

            {/* Posts */}
            <div className="ml-8 md:ml-16 space-y-6">
                {posts.map((post, index) => (
                    <TimelineCard key={post.id} post={post} index={index} />
                ))}
            </div>
        </div>
    );
}

function TimelineCard({ post, index }: { post: Post; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={`/blog/${post.slug}`}
                className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-6">
                    {/* Image */}
                    {post.image && (
                        <div className="relative h-48 md:h-full overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-4 md:p-6 flex flex-col justify-between">
                        {/* Category badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {post.category.name}
                            </span>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Tag className="w-3 h-3" />
                                    {post.tags[0].name}
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readingTime} min
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {post.likes.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Helper function to group posts by date
function groupPostsByDate(posts: Post[]): Record<string, Post[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups: Record<string, Post[]> = {
        Today: [],
        "This Week": [],
        "This Month": [],
        Older: [],
    };

    posts.forEach((post) => {
        const postDate = new Date(post.publishedAt);
        if (postDate >= today) {
            groups.Today.push(post);
        } else if (postDate >= weekAgo) {
            groups["This Week"].push(post);
        } else if (postDate >= monthAgo) {
            groups["This Month"].push(post);
        } else {
            groups.Older.push(post);
        }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) {
            delete groups[key];
        }
    });

    return groups;
}
