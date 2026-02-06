import { prisma } from "@/app/lib/prisma";
import PostForm from "./post-form";

export default async function NewPostPage() {
  // Fetch categories to populate the dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Pass them to the client form
  return <PostForm categories={categories} />;
}
