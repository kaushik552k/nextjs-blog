"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { siteConfig } from "@/app/data/mock";
import { ArrowDown, Code2, Palette, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingIcons = [
    { Icon: Code2, color: "text-pink-500", delay: 0, x: -120, y: -60 },
    { Icon: Palette, color: "text-purple-500", delay: 0.2, x: 120, y: -40 },
    { Icon: Zap, color: "text-yellow-500", delay: 0.4, x: -100, y: 60 },
    { Icon: Sparkles, color: "text-cyan-400", delay: 0.6, x: 100, y: 80 },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-border),0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-border),0.3)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Avatar with floating icons */}
        <motion.div
          variants={itemVariants}
          className="relative inline-block mb-8"
        >
          <div className="relative">
            {/* Avatar container */}
            <motion.div
              className="relative w-40 h-40 mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Glowing ring */}
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ padding: "3px" }}
              />

              {/* Avatar image - uses light version as default */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[rgb(var(--color-background))]">
                <img
                  src={siteConfig.avatar.light}
                  alt="Master Kaushik Dutta"
                  className="w-full h-full object-cover dark:hidden"
                />
                <img
                  src={siteConfig.avatar.dark}
                  alt="Master Kaushik Dutta"
                  className="w-full h-full object-cover hidden dark:block"
                />
              </div>
            </motion.div>

            {/* Floating icons around avatar */}
            {floatingIcons.map(({ Icon, color, delay, x, y }, index) => (
              <motion.div
                key={index}
                className={`absolute top-1/2 left-1/2 ${color}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: x,
                  y: y,
                }}
                transition={{
                  delay: delay + 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Icon size={24} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-[rgb(var(--color-text-primary))]">
            Hey! I'm{" "}
          </span>
          <span className="gradient-text">Kaushik</span>
          <motion.span
            className="inline-block ml-2"
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          >
            👋
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          I create{" "}
          <span className="text-pink-500 font-semibold">
            friendly tutorials
          </span>{" "}
          for developers. Focus on{" "}
          <span className="text-cyan-500 font-semibold">React</span>,{" "}
          <span className="text-purple-500 font-semibold">CSS</span>,{" "}
          <span className="text-yellow-500 font-semibold">Animation</span>, and
          more!
        </motion.p>

        {/* Tags */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {["Interactive", "Visual", "Whimsical", "In-depth"].map(
            (tag, index) => (
              <motion.span
                key={tag}
                className="px-4 py-2 rounded-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-sm font-medium text-[rgb(var(--color-text-secondary))]"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgb(var(--color-accent-primary))",
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {tag}
              </motion.span>
            ),
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-[rgb(var(--color-text-muted))]">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
