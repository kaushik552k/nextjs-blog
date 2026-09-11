import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // ─── Image Optimization ───────────────────────────────────────────────────
  images: {
    // Serve WebP first, then AVIF for maximum browser compatibility savings
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        // Allow optimising the avatar images from joshwcomeau.com
        protocol: "https",
        hostname: "www.joshwcomeau.com",
        pathname: "/images/**",
      },
    ],
  },

  // ─── Bundle Optimisation ──────────────────────────────────────────────────
  experimental: {
    // Tree-shake large icon/radix packages — only import what's actually used.
    // This alone can remove 20-40 KiB from the initial JS bundle.
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "framer-motion",
    ],
  },

  // ─── HTTP Cache-Control Headers ───────────────────────────────────────────
  async headers() {
    return [
      {
        // Next.js hashes all static asset filenames → safe to cache forever.
        // Fixes "bfcache blocked" and reduces repeat-visit payload to near-zero.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public folder assets (fonts, images placed manually)
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

