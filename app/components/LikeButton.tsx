"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
// import { useSoundEffect } from '../hooks/useSoundEffect'; // Use dummy for now if needed

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

  // Safe local storage check
  useEffect(() => {
    if (!postSlug) return;
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    if (likedPosts[postSlug]) {
      setIsLiked(true);
    }
  }, [postSlug]);

  const handleLike = () => {
    // playCelebration(); // Add sound back if you have the hook
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 600);
    setLikes((prev) => prev + 1);
    setIsLiked(true);

    if (postSlug) {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      likedPosts[postSlug] = { liked: true };
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
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
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isLiked
              ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30"
              : "bg-card border-2 border-border hover:border-pink-400"
          }`}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-0 group-hover:opacity-20"
            animate={
              isLiked ? { scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] } : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <motion.div
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Heart
              className={`w-7 h-7 transition-all duration-300 ${
                isLiked
                  ? "text-white fill-white"
                  : "text-muted-foreground group-hover:text-pink-500"
              }`}
            />
          </motion.div>

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
        </div>
      </motion.button>

      <div className="text-center">
        <motion.div
          key={likes}
          initial={{ scale: 1.2, color: "rgb(236, 72, 153)" }}
          animate={{ scale: 1, color: "var(--foreground)" }}
          className="text-2xl font-bold text-foreground"
        >
          {likes >= 1000 ? (likes / 1000).toFixed(1) + "k" : likes}
        </motion.div>
        <span className="text-sm text-muted-foreground">likes</span>
      </div>
    </div>
  );
};

export default LikeButton;
