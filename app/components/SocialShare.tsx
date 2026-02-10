"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";

interface SocialShareProps {
    url: string;
    title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const shareButtons = [
        {
            name: "Twitter",
            icon: Twitter,
            url: shareUrls.twitter,
            gradient: "from-sky-400 to-blue-500",
            hoverGradient: "hover:from-sky-500 hover:to-blue-600",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: shareUrls.linkedin,
            gradient: "from-blue-600 to-blue-700",
            hoverGradient: "hover:from-blue-700 hover:to-blue-800",
        },
        {
            name: "Facebook",
            icon: Facebook,
            url: shareUrls.facebook,
            gradient: "from-blue-500 to-indigo-600",
            hoverGradient: "hover:from-blue-600 hover:to-indigo-700",
        },
    ];

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <h3 className="text-lg font-semibold text-foreground">Share this post</h3>

            <div className="flex flex-wrap items-center justify-center gap-3">
                {shareButtons.map((button) => (
                    <motion.a
                        key={button.name}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${button.gradient} ${button.hoverGradient} text-white font-medium shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{button.name}</span>
                    </motion.a>
                ))}

                {/* Copy Link Button */}
                <motion.button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-300 ${copied
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            : "bg-card border-2 border-border text-foreground hover:border-primary"
                        }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Link2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy Link</span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
