"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

/**
 * PlaygroundGate — tiny client component that only wraps children with
 * Header/Footer when we are NOT on the /playground route.
 *
 * Keeping this isolated means the parent layout stays a Server Component,
 * which dramatically reduces the initial JS bundle and TBT.
 */
function PlaygroundGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/playground") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex flex-col">
      <Header />
      <main className="grow container mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PlaygroundGate>{children}</PlaygroundGate>;
}

