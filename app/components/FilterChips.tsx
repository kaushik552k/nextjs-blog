"use client";

import { motion } from "framer-motion";

type Filter = "today" | "week" | "month" | "all";

interface FilterChipsProps {
    activeFilter: Filter;
    onFilterChange: (filter: Filter) => void;
    counts: {
        today: number;
        week: number;
        month: number;
        all: number;
    };
}

export default function FilterChips({
    activeFilter,
    onFilterChange,
    counts,
}: FilterChipsProps) {
    const filters: { value: Filter; label: string }[] = [
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "all", label: "All Time" },
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.value;
                const count = counts[filter.value];

                return (
                    <motion.button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30"
                                : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{filter.label}</span>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {count}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
