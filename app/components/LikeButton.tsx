"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import useSoundEffect from "@/app/hooks/useSoundEffect"; // ✅ Hook is back!

const LikeButton = ({
  initialLikes = 0,
  postSlug,
}: {
  initialLikes?: number;
  postSlug?: string;
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [clickCount, setClickCount] = useState(0); // Track clicks for local storage

  // ✅ Destructure sound functions
  const { playCelebration } = useSoundEffect();

  // Check if user has already liked this post
  useEffect(() => {
    if (!postSlug) return;
    const storageKey = `liked_${postSlug}`;
    const hasLiked = localStorage.getItem(storageKey);
    if (hasLiked) {
      setIsLiked(true);
    }
  }, [postSlug]);

  const handleLike = async () => {
    // Check if already liked this post
    if (!postSlug) return;

    const storageKey = `liked_${postSlug}`;
    const hasLiked = localStorage.getItem(storageKey);

    if (hasLiked) {
      // Already liked, just show animation
      playCelebration();
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
      return;
    }

    // ✅ 1. Play Sound
    playCelebration();

    // 2. Show Particles
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 600);

    // 3. Optimistic Update
    const previousLikes = likes;
    setLikes((prev) => prev + 1);
    setIsLiked(true);

    // 4. Save to Local Storage (prevent duplicate likes)
    localStorage.setItem(storageKey, "true");

    // 5. Persist to Database
    try {
      const response = await fetch(`/api/posts/${postSlug}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to save like");
      }

      const data = await response.json();
      // Sync with server response
      setLikes(data.likes);
    } catch (error) {
      console.error("Error saving like:", error);
      // Revert on error
      setLikes(previousLikes);
      setIsLiked(false);
      localStorage.removeItem(storageKey);
    }
  };

  const formatLikes = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
    }
    return num.toLocaleString();
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.cos((i / 12) * Math.PI * 2) * 40,
    y: Math.sin((i / 12) * Math.PI * 2) * 40,
    delay: i * 0.02,
  }));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={handleLike}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isLiked
            ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30"
            : "bg-card border-2 border-border hover:border-pink-400"
            }`}
        >
          {/* Background Pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-0 group-hover:opacity-20"
            animate={
              isLiked ? { scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] } : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Heart Icon - Fixed Animation */}
          <motion.div
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Heart
              className={`w-7 h-7 transition-all duration-300 ${isLiked
                ? "text-white fill-white"
                : "text-muted-foreground group-hover:text-pink-500"
                }`}
            />
          </motion.div>

          {/* Particles */}
          <AnimatePresence>
            {showParticles &&
              particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full bg-pink-500"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
          </AnimatePresence>

          {/* +1 Floating Text */}
          <AnimatePresence>
            {showParticles && (
              <motion.span
                className="absolute -top-8 text-pink-500 font-bold text-lg pointer-events-none"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                +1
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Tooltip */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-card border border-border text-sm text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          {isLiked ? "Thanks! Click again!" : "Like this post"}
        </div>
      </motion.button>

      {/* Like Count */}
      <div className="text-center">
        <motion.div
          key={likes}
          initial={{ scale: 1.2, color: "rgb(236, 72, 153)" }}
          animate={{ scale: 1, color: "var(--foreground)" }}
          className="text-2xl font-bold text-foreground"
        >
          {formatLikes(likes)}
        </motion.div>
        <span className="text-sm text-muted-foreground">
          {likes === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
};

export default LikeButton;
