import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "../../new/post-form"; // Import the shared form

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // 1. Fetch the Post
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  // 2. Fetch Categories (for the dropdown)
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 3. Render Form with Data
  return <PostForm categories={categories} initialData={post} />;
}
