import Link from "next/link";
import { signOut } from "@/auth";
import {
  LayoutDashboard,
  FileText,
  Tags,
  FolderTree,
  LogOut,
  Settings,
} from "lucide-react"; // Make sure you have lucide-react installed

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <aside className="hidden w-64 flex-col border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            KaushikCMS
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
          />
          <NavItem
            href="/admin/posts"
            icon={<FileText size={20} />}
            label="All Posts"
          />
          <NavItem
            href="/admin/categories"
            icon={<FolderTree size={20} />}
            label="Categories"
          />
          <NavItem href="/admin/tags" icon={<Tags size={20} />} label="Tags" />
        </nav>

        <div className="border-t border-gray-800 p-4">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}

// Helper Component for Navigation Links
function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}
