"use client";

import React from "react";
import { motion } from "framer-motion";
import Callout from "./Callout";
import CodeBlock from "./CodeBlock";

const ParagraphBlock = ({ content, index }: any) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="text-lg text-muted-foreground leading-relaxed mb-6"
  >
    {content}
  </motion.p>
);

const Heading2Block = ({ content }: any) => (
  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-12 mb-6">
    {content}
  </h2>
);

const ListBlock = ({ items }: any) => (
  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
    {items.map((item: string, i: number) => (
      <li key={i} className="text-lg leading-relaxed">
        {item}
      </li>
    ))}
  </ul>
);

const QuoteBlock = ({ content }: any) => (
  <blockquote className="my-8 pl-6 border-l-4 border-pink-500 italic text-lg text-muted-foreground">
    {content}
  </blockquote>
);

const MDXRenderer = ({ content }: { content: any[] }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="mdx-content">
      {content.map((block, i) => {
        const key = `block-${i}`;
        if (block.type === "paragraph")
          return <ParagraphBlock key={key} content={block.content} index={i} />;
        if (block.type === "heading")
          return <Heading2Block key={key} content={block.content} />;
        if (block.type === "callout")
          return (
            <Callout key={key} variant={block.variant} title={block.title}>
              {block.content}
            </Callout>
          );
        if (block.type === "code")
          return (
            <CodeBlock
              key={key}
              code={block.content}
              language={block.language}
              filename={block.filename}
            />
          );
        if (block.type === "list")
          return <ListBlock key={key} items={block.items} />;
        if (block.type === "quote")
          return <QuoteBlock key={key} content={block.content} />;
        if (block.type === "divider")
          return <hr key={key} className="my-12 border-border" />;
        return null;
      })}
    </div>
  );
};

export default MDXRenderer;
