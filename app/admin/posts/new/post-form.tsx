"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPost, updatePost } from "@/app/lib/actions"; // 👈 Import updatePost
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import PostEditor from "./post-editor";
import slugify from "slugify";

// Define the shape of a Post (Post + Category Relation)
interface PostData {
  id: string;
  title: string;
  slug: string;
  content: any; // JSON
  image?: string | null;
  excerpt?: string | null;
  published: boolean;
  featured: boolean;
  categoryId: string;
  tags?: { name: string }[];
}

interface PostFormProps {
  categories: any[];
  initialData?: PostData | null; // 👈 Optional Prop for Edit Mode
}

export default function PostForm({ categories, initialData }: PostFormProps) {
  // 1. Determine which Action to use (Create vs Update)
  const action = initialData ? updatePost : createPost;

  const [state, formAction, isPending] = useActionState(action, null);

  // 2. Setup Form with Default Values (if editing)
  const { register, setValue, watch } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      image: initialData?.image || "",
      excerpt: initialData?.excerpt || "",
      categoryId: initialData?.categoryId || "",
      published: initialData?.published ? "true" : "false", // Convert boolean to string for select
      featured: initialData?.featured ?? false,
      tags: initialData?.tags?.map((t) => t.name).join(", ") || "",
    },
  });

  // 3. Handle Initial JSON Content for the Editor
  const initialBlocks = initialData?.content
    ? Array.isArray(initialData.content)
      ? initialData.content
      : []
    : [];

  const [jsonContent, setJsonContent] = useState(JSON.stringify(initialBlocks));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    // Only auto-generate slug if we are creating a NEW post (don't change it on edit unless user wants to)
    if (!initialData) {
      const slug = slugify(title, { lower: true, strict: true });
      setValue("slug", slug);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold">
            {initialData ? "Edit Post" : "Write New Post"}
          </h1>
        </div>

        <button
          form="post-form"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>

      <form
        id="post-form"
        action={formAction}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* IMPORTANT: If editing, we need to pass the ID */}
        {initialData && (
          <input type="hidden" name="postId" value={initialData.id} />
        )}

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <input
              {...register("title", { required: true })}
              onChange={handleTitleChange}
              placeholder="Post Title..."
              className={`w-full text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white px-0
                ${initialData ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "text-gray-500"}
  `}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                {...register("slug", { required: true })}
                readOnly={!!initialData}
                placeholder="post-slug-url"
                className="w-full text-sm font-mono text-gray-500 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
              />
              <select
                {...register("categoryId", { required: true })}
                className="w-full text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-600 dark:text-gray-300"
              >
                <option value="" disabled>
                  Select Category...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                {...register("tags")}
                placeholder="Next.js, System Design, Tutorial"
                className="w-full text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-400">
                Separate tags with commas. New tags will be created
                automatically.
              </p>
            </div>
            <textarea
              {...register("excerpt")}
              placeholder="Short excerpt for SEO..."
              className="w-full h-20 text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 resize-none focus:outline-none"
            />
          </div>

          {/* Pass initialBlocks to the Editor */}
          <PostEditor
            initialBlocks={initialBlocks}
            onChange={(blocks) => setJsonContent(JSON.stringify(blocks))}
          />
          <input type="hidden" name="content" value={jsonContent} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Cover Image
              </label>
              <input
                {...register("image")}
                placeholder="https://..."
                className="w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Post?
              </span>
              <input
                type="checkbox"
                {...register("featured")}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Publish Status
              </label>
              <select
                {...register("published")}
                className="w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 px-3 py-2 text-sm"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
