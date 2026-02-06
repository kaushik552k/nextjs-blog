"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Code,
  Type,
  MessageSquare,
  Heading as HeadingIcon,
  GripVertical,
} from "lucide-react";

// Define the shape of our blocks based on your JSON
type Block =
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: number; content: string }
  | { type: "code"; content: string; language: string; filename?: string }
  | {
      type: "callout";
      title: string;
      content: string;
      variant: "info" | "success" | "warning" | "danger";
    };

interface PostEditorProps {
  onChange: (blocks: Block[]) => void;
  initialBlocks?: Block[];
}

export default function PostEditor({
  onChange,
  initialBlocks = [],
}: PostEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const updateBlock = (index: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    // @ts-ignore
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addBlock = (type: Block["type"]) => {
    let newBlock: Block;
    if (type === "paragraph") newBlock = { type: "paragraph", content: "" };
    if (type === "heading")
      newBlock = { type: "heading", level: 2, content: "" };
    if (type === "code")
      newBlock = {
        type: "code",
        content: "",
        language: "javascript",
        filename: "",
      };
    if (type === "callout")
      newBlock = {
        type: "callout",
        title: "Note",
        content: "",
        variant: "info",
      };

    // @ts-ignore
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className="absolute -right-3 -top-3 hidden rounded-full bg-red-100 p-1.5 text-red-500 shadow-sm hover:bg-red-200 group-hover:flex"
            >
              <Trash2 size={14} />
            </button>

            {/* Render Input based on Type */}
            {block.type === "paragraph" && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(index, "content", e.target.value)}
                placeholder="Type your paragraph text..."
                className="w-full resize-none bg-transparent p-2 text-gray-800 outline-none dark:text-gray-200"
                rows={3}
              />
            )}

            {block.type === "heading" && (
              <div className="flex gap-2">
                <select
                  value={block.level}
                  onChange={(e) =>
                    updateBlock(index, "level", parseInt(e.target.value))
                  }
                  className="rounded border border-gray-200 bg-gray-50 px-2 text-sm font-bold dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  value={block.content}
                  onChange={(e) =>
                    updateBlock(index, "content", e.target.value)
                  }
                  placeholder="Heading Text"
                  className="w-full bg-transparent text-xl font-bold outline-none"
                />
              </div>
            )}

            {block.type === "code" && (
              <div className="space-y-2 rounded-lg bg-gray-950 p-4">
                <div className="flex gap-2 border-b border-gray-800 pb-2">
                  <input
                    value={block.filename}
                    onChange={(e) =>
                      updateBlock(index, "filename", e.target.value)
                    }
                    placeholder="filename.js"
                    className="bg-transparent text-xs text-gray-400 outline-none"
                  />
                  <input
                    value={block.language}
                    onChange={(e) =>
                      updateBlock(index, "language", e.target.value)
                    }
                    placeholder="lang"
                    className="w-16 bg-transparent text-right text-xs text-gray-500 outline-none"
                  />
                </div>
                <textarea
                  value={block.content}
                  onChange={(e) =>
                    updateBlock(index, "content", e.target.value)
                  }
                  placeholder="// Paste your code here"
                  className="w-full resize-none font-mono text-sm text-gray-300 bg-transparent outline-none"
                  rows={6}
                />
              </div>
            )}

            {block.type === "callout" && (
              <div
                className={`rounded-lg border-l-4 p-4 ${
                  block.variant === "info"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : block.variant === "warning"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : block.variant === "success"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div className="mb-2 flex gap-2">
                  <select
                    value={block.variant}
                    onChange={(e) =>
                      updateBlock(index, "variant", e.target.value)
                    }
                    className="bg-transparent text-xs font-bold uppercase tracking-wide opacity-50 outline-none"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                  <input
                    value={block.title}
                    onChange={(e) =>
                      updateBlock(index, "title", e.target.value)
                    }
                    className="bg-transparent font-bold outline-none"
                    placeholder="Callout Title"
                  />
                </div>
                <textarea
                  value={block.content}
                  onChange={(e) =>
                    updateBlock(index, "content", e.target.value)
                  }
                  className="w-full resize-none bg-transparent outline-none"
                  placeholder="Callout content..."
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900/50">
        <ToolButton
          onClick={() => addBlock("paragraph")}
          icon={<Type size={18} />}
          label="Text"
        />
        <ToolButton
          onClick={() => addBlock("heading")}
          icon={<HeadingIcon size={18} />}
          label="Heading"
        />
        <ToolButton
          onClick={() => addBlock("code")}
          icon={<Code size={18} />}
          label="Code"
        />
        <ToolButton
          onClick={() => addBlock("callout")}
          icon={<MessageSquare size={18} />}
          label="Callout"
        />
      </div>
    </div>
  );
}

function ToolButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
