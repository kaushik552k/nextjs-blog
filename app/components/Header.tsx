"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "Latest", href: "/latest" },
  { name: "Blogs", href: "/blog" },
  { name: "Practice", href: "/practice" },
  // { name: "DSA", href: "/dsa" },
  { name: "Playground", href: "/playground" },
  {
    name: "Portfolio",
    href: "https://kaushik-dutta.vercel.app/",
    target: "_blank",
  },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // passive: true is critical — tells browser this handler never calls preventDefault,
    // allowing it to optimise scrolling on the compositor thread (removes scroll jank).
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  K
                </motion.div>
                {/* CSS keyframe animation — zero JS overhead vs framer-motion infinite loop */}
                <span
                  className="absolute -top-1 -right-1 text-yellow-400 animate-[spin_4s_linear_infinite]"
                  style={{ fontSize: "14px" }}
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">
                MASTER KAUSHIK DUTTA
              </span>
            </Link>

            {/* Desktop Navigation
                Plain <Link> tags — removed per-item motion.span entrance animations.
                Those staggered animations were running on every navigation and
                contributing to TBT. Hover effects are kept via CSS transition-colors. */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.target}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="relative text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle
                  Only hide the *icon* until mounted — NOT the whole button or header.
                  The button shell renders immediately → no CLS, no flash of invisible header.
                  Previously `return null` caused the entire header to vanish until hydration. */}
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-card border border-border hover:border-primary transition-colors overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {mounted && (
                    <motion.div
                      key={theme === "dark" ? "moon" : "sun"}
                      initial={{ y: 30, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -30, opacity: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {theme === "dark" ? (
                        <Moon className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-amber-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-12 h-12 rounded-xl flex items-center justify-center bg-card border border-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-background border-l border-border p-6 pt-24"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground py-3 px-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
