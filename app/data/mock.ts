export const siteConfig = {
  name: "Kaushik Dutta",
  tagline:
    "Friendly tutorials for developers. Focus on React, CSS, Animation, and more!",
  avatar: {
    light: "https://www.joshwcomeau.com/images/josh/josh-happy-light.png",
    dark: "https://www.joshwcomeau.com/images/josh/josh-happy-dark.png",
  },
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  gradient: string;
  icon: string;
  subcategories: SubCategory[];
};

export const mainCategories: Category[] = [
  {
    id: "system-design",
    name: "System Design",
    slug: "system-design",
    description:
      "Deep dives into distributed systems, architecture patterns, and scalability.",
    gradient: "from-violet-500 to-purple-600",
    icon: "Database",
    subcategories: [
      {
        id: "distributed-systems",
        name: "Distributed Systems",
        slug: "distributed-systems",
      },
      { id: "databases", name: "Databases", slug: "databases" },
      {
        id: "architecture",
        name: "Architecture Patterns",
        slug: "architecture",
      },
      { id: "scalability", name: "Scalability", slug: "scalability" },
    ],
  },
  {
    id: "web-dev",
    name: "Web Dev",
    slug: "web-dev",
    description:
      "Modern web development tutorials covering React, CSS, JavaScript, and more.",
    gradient: "from-pink-500 to-rose-500",
    icon: "Code2",
    subcategories: [
      { id: "react", name: "React", slug: "react" },
      { id: "css", name: "CSS", slug: "css" },
      { id: "javascript", name: "JavaScript", slug: "javascript" },
      { id: "animation", name: "Animation", slug: "animation" },
      { id: "nextjs", name: "Next.js", slug: "nextjs" },
    ],
  },
  {
    id: "ai",
    name: "AI",
    slug: "ai",
    description:
      "Exploring artificial intelligence, machine learning, and LLMs for developers.",
    gradient: "from-cyan-400 to-blue-600",
    icon: "Brain",
    subcategories: [
      { id: "llms", name: "LLMs & GPT", slug: "llms" },
      {
        id: "machine-learning",
        name: "Machine Learning",
        slug: "machine-learning",
      },
      { id: "ai-tools", name: "AI Tools", slug: "ai-tools" },
      { id: "prompting", name: "Prompt Engineering", slug: "prompting" },
    ],
  },
];

export const blogPosts = [
  {
    id: 1,
    slug: "understanding-distributed-systems",
    title: "Understanding Distributed Systems",
    subtitle: "A visual guide to building resilient architectures",
    excerpt:
      "Distributed systems are the backbone of modern applications. In this comprehensive guide, we'll explore the fundamental concepts, from CAP theorem to consensus algorithms.",
    category: "system-design",
    subcategory: "distributed-systems",
    gradient: "from-violet-500 to-purple-600",
    publishedAt: "June 15th, 2024",
    updatedAt: "July 2nd, 2025",
    readingTime: "18 min read",
    likes: 42847,
    featured: true,
    tags: ["distributed-systems", "architecture", "scalability"],
  },
  // ... (I have kept the structure consistent, you can paste the rest of your posts here)
  {
    id: 4,
    slug: "promises-from-ground-up",
    title: "Promises From The Ground Up",
    subtitle: "Building deep intuition for async JavaScript",
    excerpt:
      'The "Promises" API is a surprisingly tricky part of modern JavaScript. Without the right context, it doesn\'t make much sense at all!',
    category: "web-dev",
    subcategory: "javascript",
    gradient: "from-yellow-400 to-amber-500",
    publishedAt: "June 3rd, 2024",
    updatedAt: "March 18th, 2025",
    readingTime: "22 min read",
    likes: 61077,
    featured: true,
    tags: ["javascript", "promises", "async"],
  },
  {
    id: 5,
    slug: "interactive-guide-to-flexbox",
    title: "An Interactive Guide to Flexbox",
    subtitle: "Master CSS layouts with hands-on examples",
    excerpt:
      "Flexbox is one of the most important CSS layout tools, but it can be confusing at first.",
    category: "web-dev",
    subcategory: "css",
    gradient: "from-pink-500 to-rose-500",
    publishedAt: "March 15th, 2024",
    readingTime: "25 min read",
    likes: 89234,
    featured: true,
    tags: ["css", "flexbox", "layout"],
  },
  {
    id: 8,
    slug: "building-with-llms",
    title: "Building Applications with LLMs",
    subtitle: "A practical guide for developers",
    excerpt:
      "Large Language Models are transforming how we build software. Practical patterns for integrating LLMs into your applications.",
    category: "ai",
    subcategory: "llms",
    gradient: "from-cyan-400 to-blue-600",
    publishedAt: "July 1st, 2025",
    readingTime: "28 min read",
    likes: 52341,
    featured: true,
    tags: ["llm", "gpt", "ai"],
  },
];

// Popular content for sidebar/homepage
export const popularContent = blogPosts;

export const navLinks = [
  { name: "Latest", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Goodies", href: "/goodies" },
];

export const getPostsByCategory = (categorySlug: string) => {
  return blogPosts.filter((post) => post.category === categorySlug);
};

export const getPostsBySubcategory = (
  categorySlug: string,
  subcategorySlug: string,
) => {
  return blogPosts.filter(
    (post) =>
      post.category === categorySlug && post.subcategory === subcategorySlug,
  );
};

export const getFeaturedPosts = () => {
  return blogPosts.filter((post) => post.featured);
};

export const getPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getCategoryBySlug = (slug: string) => {
  return mainCategories.find((cat) => cat.slug === slug);
};
