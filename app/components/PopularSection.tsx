"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, ArrowRight, Star, Heart } from "lucide-react";
import { popularContent } from "@/app/data/mock";

const PopularSection = () => {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Popular Content
            </h2>
            <p className="text-muted-foreground">
              The most-loved tutorials and guides
            </p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {popularContent.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/blog/${item.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-pink-500/50 transition-all"
              >
                {/* Rank number */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                      index < 3
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                        : "bg-background text-muted-foreground border border-border"
                    }`}
                  >
                    {index < 3 && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    )}
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-pink-500 transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      {(item.likes / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSection;
