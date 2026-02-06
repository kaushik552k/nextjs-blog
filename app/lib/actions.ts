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
    .split(",") // Split by comma
    .map((tag) => tag.trim()) // Remove extra spaces
    .filter((tag) => tag.length > 0) // Remove empty strings
    .map((tag) => ({
      where: { slug: tag.toLowerCase().replace(/\s+/g, "-") }, // slugify
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

// 👇 UPDATED SCHEMA: Matches your new form fields
const PostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  image: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"), // 👈 NEW & REQUIRED
  excerpt: z.string().optional(), // 👈 NEW
  featured: z.string().optional(), // 👈 NEW
  published: z.string().transform((val) => val === "true"),
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
    categoryId: formData.get("categoryId"), // 👈 Fetch from form
    excerpt: formData.get("excerpt"), // 👈 Fetch from form
    featured: formData.get("featured"), // 👈 Fetch from form
    published: formData.get("published"),
    tags: formData.get("tags"),
  });

  if (!validatedFields.success) {
    // Helpful error logging
    console.error("Validation Failed:", validatedFields.error.flatten());
    return { message: "Missing Fields. Please check Category and Title." };
  }

  const {
    title,
    slug,
    content,
    image,
    categoryId,
    excerpt,
    featured,
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
        excerpt: excerpt || "", // 👈 Save excerpt
        featured: featured === "on", // 👈 Convert checkbox "on" to boolean
        published,
        readingTime,
        authorId: user.id,
        categoryId: categoryId, // 👈 FIXED: This satisfies the "Required" error
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

  // 1. Get the Post ID (Hidden Input)
  const postId = formData.get("postId") as string;

  const isFeatured = formData.get("featured") === "on";

  // 2. Validate Fields
  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    image: formData.get("image"),
    categoryId: formData.get("categoryId"),
    excerpt: formData.get("excerpt"),
    published: formData.get("published"),
    tags: formData.get("tags"),
  });

  if (!validatedFields.success) {
    return { message: "Missing Fields" };
  }

  const { title, content, image, categoryId, excerpt, published, tags } =
    validatedFields.data;

  // 3. Process Content (Reading Time)
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
        featured: isFeatured,
        published,
        readingTime,
        categoryId,
        tags: {
          set: [], // Disconnect all current tags
          connectOrCreate: parseTags(tags), // Connect new ones
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
