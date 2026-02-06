"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPost, updatePost } from "@/app/lib/actions";
import { Save, ArrowLeft, AlertCircle } from "lucide-react"; // 👈 Added AlertCircle for errors
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
  initialData?: PostData | null;
}

export default function PostForm({ categories, initialData }: PostFormProps) {
  // 1. Determine which Action to use (Create vs Update)
  const action = initialData ? updatePost : createPost;

  const [state, formAction, isPending] = useActionState(action, null);

  // 2. Setup Form with Validation Mode
  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid }, // 👈 Get error state
  } = useForm({
    mode: "onChange", // 👈 Validate in real-time
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      image: initialData?.image || "",
      excerpt: initialData?.excerpt || "",
      categoryId: initialData?.categoryId || "",
      published: initialData?.published ? "true" : "false",
      featured: initialData?.featured ?? false,
      tags: initialData?.tags?.map((t) => t.name).join(", ") || "",
      // Initialize content for validation tracking
      content: initialData?.content
        ? JSON.stringify(initialData.content)
        : "[]",
    },
  });

  // 3. Handle Initial JSON Content for the Editor
  const initialBlocks = initialData?.content
    ? Array.isArray(initialData.content)
      ? initialData.content
      : []
    : [];

  const [jsonContent, setJsonContent] = useState(JSON.stringify(initialBlocks));

  // Sync Editor to Form Validation
  const handleEditorChange = (blocks: any[]) => {
    const stringified = JSON.stringify(blocks);
    setJsonContent(stringified);
    // Manually update the hidden form field so 'isValid' knows about it
    setValue("content", stringified, { shouldValidate: true });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title, { shouldValidate: true });
    // Only auto-generate slug if we are creating a NEW post
    if (!initialData) {
      const slug = slugify(title, { lower: true, strict: true });
      setValue("slug", slug, { shouldValidate: true });
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
          disabled={isPending || !isValid} // 👈 DISABLE IF INVALID
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all
            ${
              isPending || !isValid
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-md"
            }
          `}
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
        {initialData && (
          <input type="hidden" name="postId" value={initialData.id} />
        )}

        {/* Hidden Content Field for Validation */}
        <input
          type="hidden"
          {...register("content", {
            validate: (value) => {
              try {
                const parsed = JSON.parse(value);
                return parsed.length > 0 || "Content cannot be empty";
              } catch (e) {
                return "Invalid content";
              }
            },
          })}
          value={jsonContent}
        />

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            {/* TITLE */}
            <div>
              <input
                {...register("title", { required: "Title is required" })}
                onChange={handleTitleChange}
                placeholder="Post Title..."
                className={`w-full text-4xl font-bold bg-transparent border-none focus:ring-0 px-0 
                    ${errors.title ? "placeholder-red-300" : "placeholder-gray-300 dark:placeholder-gray-700"}
                  `}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SLUG */}
              <div className="flex flex-col">
                <input
                  {...register("slug", { required: "Slug is required" })}
                  readOnly={!!initialData}
                  placeholder="post-slug-url"
                  className={`w-full text-sm font-mono bg-transparent border rounded-md px-3 py-2 
                        ${initialData ? "text-gray-400 cursor-not-allowed bg-gray-50" : "text-gray-500"}
                        ${errors.slug ? "border-red-500 bg-red-50" : "border-gray-200 dark:border-gray-700"}
                    `}
                />
                {errors.slug && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </span>
                )}
              </div>

              {/* CATEGORY */}
              <div className="flex flex-col">
                <select
                  {...register("categoryId", {
                    required: "Please select a category",
                  })}
                  className={`w-full text-sm bg-transparent border rounded-md px-3 py-2 text-gray-600 dark:text-gray-300
                        ${errors.categoryId ? "border-red-500 bg-red-50" : "border-gray-200 dark:border-gray-700"}
                    `}
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.categoryId.message as string}
                  </span>
                )}
              </div>
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

          {/* EDITOR */}
          <div className="space-y-2">
            <PostEditor
              initialBlocks={initialBlocks}
              onChange={handleEditorChange}
            />
            {errors.content && (
              <p className="text-red-500 text-sm flex items-center gap-1 justify-end">
                <AlertCircle size={14} /> Post content cannot be empty
              </p>
            )}
          </div>
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
