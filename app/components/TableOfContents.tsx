"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Heading = {
    id: string;
    text: string;
    level: number;
};

type Props = {
    content: any[];
};

// Helper to create URL-friendly IDs from heading text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function TableOfContents({ content }: Props) {
    const [activeId, setActiveId] = useState<string>("");

    // Extract headings from content
    const headings: Heading[] = content
        .filter((block: any) => block.type === "heading")
        .map((block: any) => ({
            id: slugify(block.content),
            text: block.content,
            level: block.level || 2,
        }));

    // Track active section using Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-80px 0px -80% 0px",
                threshold: 0,
            }
        );

        // Observe all heading elements
        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [headings]);

    // Smooth scroll to section
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide"
        >
            <div className="space-y-4">
                {/* Header */}
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    On this page
                </h2>

                {/* TOC List */}
                <ul className="space-y-2 text-sm">
                    {headings.map((heading) => {
                        const isActive = activeId === heading.id;
                        const isH3 = heading.level === 3;

                        return (
                            <li key={heading.id} className={isH3 ? "pl-4" : ""}>
                                <button
                                    onClick={() => scrollToSection(heading.id)}
                                    className={`block w-full text-left py-1.5 px-3 rounded-lg transition-all ${isActive
                                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-card"
                                        }`}
                                >
                                    {heading.text}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </motion.nav>
    );
}
