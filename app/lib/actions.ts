"use server";

import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

function parseTags(tagsString: string | undefined) {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({
      where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
      create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, "-") },
    }));
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// 👇 UPDATED SCHEMA: Handles Checkboxes Correctly
const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content cannot be empty"),
  image: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  excerpt: z.string().optional(),

  // ✅ FIX: Correctly handle Checkbox "on" vs null
  featured: z.preprocess((val) => val === "on" || val === "true", z.boolean()),

  // Handle Select "true"/"false" strings
  published: z.preprocess((val) => val === "true", z.boolean()),

  tags: z.string().optional(),
});

export async function createPost(prevState: any, formData: FormData) {
  // 1. Security Check
  const session = await auth();
  if (!session?.user?.email) {
    return { message: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { message: "User not found" };
  }

  // 2. Validate Form Data
  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    image: formData.get("image"),
    categoryId: formData.get("categoryId"),
    excerpt: formData.get("excerpt"),
    featured: formData.get("featured"), // Will be null if unchecked
    published: formData.get("published"),
    tags: formData.get("tags"),
  });

  if (!validatedFields.success) {
    console.error("Validation Failed:", validatedFields.error.flatten());
    return {
      message: "Missing Fields. Please check Title, Slug, and Category.",
    };
  }

  const {
    title,
    slug,
    content,
    image,
    categoryId,
    excerpt,
    featured, // This is now a boolean (true/false)
    published,
    tags,
  } = validatedFields.data;

  // 3. Calculate Reading Time
  let readingTime = 1;
  let contentJson;

  try {
    contentJson = JSON.parse(content);
    const allText = contentJson
      .map((block: any) => block.content || "")
      .join(" ");
    const wordCount = allText.split(/\s+/).length;
    readingTime = Math.ceil(wordCount / 200);
    if (readingTime < 1) readingTime = 1;
  } catch (e) {
    return { message: "Invalid Content Format" };
  }

  // 4. Database Insertion
  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content: contentJson,
        image: image || null,
        excerpt: excerpt || "",
        featured, // ✅ No need for '== "on"', it's already boolean
        published,
        readingTime,
        authorId: user.id,
        categoryId: categoryId,
        tags: {
          connectOrCreate: parseTags(tags),
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Post. (Slug might be taken?)",
    };
  }

  // 5. Clean up & Redirect
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { message: "Unauthorized" };

  const postId = formData.get("postId") as string;

  // 2. Validate Fields
  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    image: formData.get("image"),
    categoryId: formData.get("categoryId"),
    excerpt: formData.get("excerpt"),
    featured: formData.get("featured"),
    published: formData.get("published"),
    tags: formData.get("tags"),
  });

  if (!validatedFields.success) {
    console.error("Validation Failed:", validatedFields.error.flatten());
    return { message: "Missing Fields" };
  }

  const {
    title,
    content,
    image,
    categoryId,
    excerpt,
    featured, // Boolean
    published,
    tags,
  } = validatedFields.data;

  // 3. Process Content
  let readingTime = 1;
  let contentJson;
  try {
    contentJson = JSON.parse(content);
    const allText = contentJson
      .map((block: any) => block.content || "")
      .join(" ");
    readingTime = Math.ceil(allText.split(/\s+/).length / 200) || 1;
  } catch (e) {
    return { message: "Invalid Content" };
  }

  // 4. Update Database
  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content: contentJson,
        image: image || null,
        excerpt: excerpt || "",
        featured, // ✅ Uses validated boolean
        published,
        readingTime,
        categoryId,
        tags: {
          set: [],
          connectOrCreate: parseTags(tags),
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Failed to update post" };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${postId}/edit`);
  redirect("/admin/posts");
}
