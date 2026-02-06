import Header from "@/app/components/Header"; // Make sure path matches your folder structure
import Footer from "@/app/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This div structure comes from your old layout to preserve the look
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
