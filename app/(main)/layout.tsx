"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPlayground = pathname === "/playground";

  // Full-screen layout for playground (no header, footer, container)
  if (isPlayground) {
    return <>{children}</>;
  }

  // Normal layout for other pages
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex flex-col">
      <Header />

      {/* The main content area with your container constraints */}
      <main className="grow container mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
