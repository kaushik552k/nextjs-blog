"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/app/lib/utils";

const variants = {
  info: {
    icon: Info,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-500",
  },
  success: {
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-500",
  },
  tip: {
    icon: Lightbulb,
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-500",
  },
};

type CalloutProps = {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
};

const Callout = ({ variant = "info", title, children }: CalloutProps) => {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative my-8 p-6 rounded-2xl border overflow-hidden",
        config.bg,
        config.border,
      )}
    >
      {/* Gradient accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          config.gradient,
        )}
      />

      <div className="flex gap-4">
        {/* Icon */}
        <div className={cn("flex-shrink-0", config.iconColor)}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          {title && <h4 className="font-bold text-foreground mb-2">{title}</h4>}
          <div className="text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Callout;
