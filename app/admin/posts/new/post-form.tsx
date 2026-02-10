"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPost, updatePost } from "@/app/lib/actions";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import PostEditor from "./post-editor";
import slugify from "slugify";

// Define the shape of a Post
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
  const action = initialData ? updatePost : createPost;
  const [state, formAction, isPending] = useActionState(action, null);

  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      image: initialData?.image || "",
      excerpt: initialData?.excerpt || "",
      categoryId: initialData?.categoryId || "",
      published: initialData ? (initialData.published ? "true" : "false") : "false", // Default to draft for new posts
      featured: initialData?.featured ?? false,
      tags: initialData?.tags?.map((t) => t.name).join(", ") || "",
      content: initialData?.content
        ? JSON.stringify(initialData.content)
        : "[]",
    },
  });

  const initialBlocks = initialData?.content
    ? Array.isArray(initialData.content)
      ? initialData.content
      : []
    : [];

  const [jsonContent, setJsonContent] = useState(JSON.stringify(initialBlocks));

  const handleEditorChange = (blocks: any[]) => {
    const stringified = JSON.stringify(blocks);
    setJsonContent(stringified);
    setValue("content", stringified, { shouldValidate: true });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title, { shouldValidate: true });
    if (!initialData) {
      const slug = slugify(title, { lower: true, strict: true });
      setValue("slug", slug, { shouldValidate: true });
    }
  };

  // Reusable Label Component for consistency
  const Label = ({
    label,
    required = false,
  }: {
    label: string;
    required?: boolean;
  }) => (
    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
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
          disabled={isPending || !isValid}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all
            ${isPending || !isValid
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

        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            {/* TITLE */}
            <div>
              <Label label="Title" required />
              <input
                {...register("title", { required: "Title is required" })}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className={`w-full text-2xl font-bold bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:ring-0 px-0 pb-2 transition-colors
                    ${errors.title ? "border-red-300 placeholder-red-300" : "dark:border-gray-700"}
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
                <Label label="Slug" required />
                <input
                  {...register("slug", { required: "Slug is required" })}
                  readOnly={!!initialData}
                  placeholder="post-slug-url"
                  className={`w-full text-sm font-mono bg-gray-50 dark:bg-gray-800 border rounded-md px-3 py-2 
                        ${initialData ? "text-gray-400 cursor-not-allowed" : "text-gray-600 dark:text-gray-300"}
                        ${errors.slug ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
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
                <Label label="Category" required />
                <select
                  {...register("categoryId", {
                    required: "Please select a category",
                  })}
                  className={`w-full text-sm bg-transparent border rounded-md px-3 py-2 text-gray-600 dark:text-gray-300
                        ${errors.categoryId ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-700"}
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

            {/* TAGS */}
            <div className="space-y-1">
              <Label label="Tags (Comma Separated)" />
              <input
                {...register("tags")}
                placeholder="Next.js, System Design, Tutorial"
                className="w-full text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
              />
            </div>

            {/* EXCERPT */}
            <div className="space-y-1">
              <Label label="Excerpt (SEO)" />
              <textarea
                {...register("excerpt")}
                placeholder="Short excerpt for search engines and cards..."
                className="w-full h-20 text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* EDITOR */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label label="Content Body" required />
              {errors.content && (
                <span className="text-red-500 text-xs font-bold flex items-center gap-1 mb-1">
                  <AlertCircle size={12} /> Content cannot be empty
                </span>
              )}
            </div>

            <PostEditor
              initialBlocks={initialBlocks}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (Settings) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Cover Image URL
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
