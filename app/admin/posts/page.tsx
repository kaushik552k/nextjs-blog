import Link from "next/link";
import { prisma } from "@/app/lib/prisma"; // Adjust path if needed
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function PostsManager() {
  // Fetch all posts, sorted by newest first
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true }, // If you want to show author name
  });

  // Server Action to Delete a Post
  async function deletePost(formData: FormData) {
    "use server";
    const postId = formData.get("postId") as string;
    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/admin/posts"); // Refresh the table instantly
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Published</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </div>
                  <div className="text-xs text-gray-500">{post.slug}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {/* If you have a 'views' field, show it. Otherwise verify schema */}
                  {/* {post.views} */} -
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded p-2 text-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                    >
                      <Pencil size={16} />
                    </Link>

                    {/* Delete Button Form */}
                    <form action={deletePost}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button className="rounded p-2 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No posts found. create one!
          </div>
        )}
      </div>
    </div>
  );
}
