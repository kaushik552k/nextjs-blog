"use client";

import React from "react";
// If you want syntax highlighting later, install react-syntax-highlighter
// npm install react-syntax-highlighter

export default function BlockRenderer({ content }: { content: any }) {
  if (!Array.isArray(content)) return null;

  return (
    <div className="space-y-6">
      {content.map((block: any, index: number) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="leading-7 text-gray-700 dark:text-gray-300"
              >
                {block.content}
              </p>
            );

          case "heading":
            const HeadingTag = `h${block.level}` as React.ElementType;
            const sizeClass =
              block.level === 1
                ? "text-3xl mt-8 mb-4"
                : block.level === 2
                  ? "text-2xl mt-8 mb-4"
                  : "text-xl mt-6 mb-3";
            return (
              <HeadingTag
                key={index}
                className={`${sizeClass} font-bold text-gray-900 dark:text-white`}
              >
                {block.content}
              </HeadingTag>
            );

          case "code":
            return (
              <div
                key={index}
                className="my-6 overflow-hidden rounded-xl bg-[#1e1e1e] border border-gray-800"
              >
                <div className="flex items-center justify-between bg-[#252526] px-4 py-2 text-xs text-gray-400">
                  <span>{block.filename || "example"}</span>
                  <span className="uppercase">{block.language}</span>
                </div>
                <pre className="overflow-x-auto p-4 text-sm text-gray-300 font-mono">
                  <code>{block.content}</code>
                </pre>
              </div>
            );

          case "callout":
            const colors = {
              info: "bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
              success:
                "bg-green-50 border-green-500 text-green-900 dark:bg-green-950/30 dark:text-green-200",
              warning:
                "bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200",
              danger:
                "bg-red-50 border-red-500 text-red-900 dark:bg-red-950/30 dark:text-red-200",
            };
            return (
              <div
                key={index}
                className={`my-6 rounded-lg border-l-4 p-4 ${colors[block.variant as keyof typeof colors]}`}
              >
                <strong className="block mb-1 font-semibold">
                  {block.title}
                </strong>
                <p>{block.content}</p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
