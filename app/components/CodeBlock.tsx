"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileCode } from "lucide-react";
import { useSoundEffect } from "@/app/hooks/useSoundEffect"; // Uncomment if you have this file

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
};

const CodeBlock = ({
  code,
  language = "javascript",
  filename,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { playSynthPop } = useSoundEffect();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    playSynthPop();
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting (kept from your original code)
  const highlightCode = (codeStr: string) => {
    if (!codeStr) return "";
    let result = codeStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const lines = result.split("\n");
    const highlightedLines = lines.map((line) => {
      let hl = line;
      if (hl.includes("//")) {
        const commentIdx = hl.indexOf("//");
        const before = hl.substring(0, commentIdx);
        const comment = hl.substring(commentIdx);
        hl = before + '<span class="text-gray-500">' + comment + "</span>";
        return hl;
      }
      hl = hl.replace(
        /(&quot;[^&]*&quot;|"[^"]*")/g,
        '<span class="text-emerald-400">$1</span>',
      );
      hl = hl.replace(/('[^']*')/g, '<span class="text-emerald-400">$1</span>');
      hl = hl.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');

      const keywords = [
        "const",
        "let",
        "var",
        "function",
        "async",
        "await",
        "return",
        "if",
        "else",
        "for",
        "while",
        "class",
        "new",
        "import",
        "export",
        "from",
        "try",
        "catch",
        "throw",
        "default",
        "this",
        "null",
        "undefined",
        "true",
        "false",
      ];
      keywords.forEach((kw) => {
        const regex = new RegExp("\\b(" + kw + ")\\b", "g");
        hl = hl.replace(regex, '<span class="text-pink-400">$1</span>');
      });
      hl = hl.replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
        '<span class="text-blue-400">$1</span>(',
      );
      return hl;
    });
    return highlightedLines.join("\n");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-6 rounded-xl overflow-hidden bg-[#1a1b26] border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16161e] border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">
            {filename || language}
          </span>
        </div>

        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
