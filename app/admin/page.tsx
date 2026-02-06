import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { FileText, Eye, ThumbsUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  // 1. Fetch Real Data
  const [postCount, categoryCount, tagCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ]);

  // Optional: Calculate total likes if you have them
  const totalLikes = await prisma.post.aggregate({
    _sum: { likes: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {session?.user?.name} 👋</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={postCount}
          icon={<FileText className="text-blue-400" />}
        />
        <StatCard
          title="Categories"
          value={categoryCount}
          icon={<FolderTree className="text-purple-400" />}
        />
        <StatCard
          title="Tags"
          value={tagCount}
          icon={<Tags className="text-pink-400" />}
        />
        <StatCard
          title="Total Likes"
          value={totalLikes._sum.likes || 0}
          icon={<ThumbsUp className="text-green-400" />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  // Simple helper for lucide icon import in this scope if needed,
  // but assuming imports are handled at top.
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">{icon}</div>
      </div>
    </div>
  );
}

// ⚠️ Add this missing import at the top if you copy-paste:
import { FolderTree, Tags } from "lucide-react";
