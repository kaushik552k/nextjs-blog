export const siteConfig = {
  name: "Kaushik",
  tagline:
    "Cultivating a digital garden at the intersection of System Design, Web Development, AI and more!",
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
  // System Design Posts
  {
    id: 1,
    slug: "understanding-distributed-systems",
    title: "Understanding Distributed Systems",
    subtitle: "A visual guide to building resilient architectures",
    excerpt:
      "Distributed systems are the backbone of modern applications. In this comprehensive guide, we'll explore the fundamental concepts, from CAP theorem to consensus algorithms, with interactive visualizations that make complex ideas intuitive.",
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
  {
    id: 2,
    slug: "database-sharding-explained",
    title: "Database Sharding Explained",
    subtitle: "When and how to horizontally scale your data",
    excerpt:
      "Sharding is one of the most powerful techniques for scaling databases, but it comes with significant complexity. Let's explore the different sharding strategies, their trade-offs, and when you should (and shouldn't) use them.",
    category: "system-design",
    subcategory: "databases",
    gradient: "from-indigo-500 to-violet-600",
    publishedAt: "May 20th, 2024",
    readingTime: "15 min read",
    likes: 31256,
    featured: false,
    tags: ["databases", "sharding", "postgresql"],
  },
  {
    id: 3,
    slug: "microservices-vs-monolith",
    title: "Microservices vs Monolith",
    subtitle: "Making the right architectural decision",
    excerpt:
      "The microservices vs monolith debate has been raging for years. In this article, we'll cut through the hype and help you understand when each approach makes sense for your specific situation.",
    category: "system-design",
    subcategory: "architecture",
    gradient: "from-purple-500 to-pink-500",
    publishedAt: "April 10th, 2024",
    readingTime: "12 min read",
    likes: 28934,
    featured: false,
    tags: ["microservices", "monolith", "architecture"],
  },
  // Web Dev Posts
  {
    id: 4,
    slug: "promises-from-ground-up",
    title: "Promises From The Ground Up",
    subtitle: "Building deep intuition for async JavaScript",
    excerpt:
      "The \"Promises\" API is a surprisingly tricky part of modern JavaScript. Without the right context, it doesn't make much sense at all! In this tutorial, you'll build an intuition for how Promises work by getting a deeper understanding of JavaScript and its limitations.",
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
      "Flexbox is one of the most important CSS layout tools, but it can be confusing at first. In this interactive guide, we'll build a mental model for how Flexbox works through dozens of interactive examples.",
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
    id: 6,
    slug: "react-server-components",
    title: "Making Sense of React Server Components",
    subtitle: "The future of React, explained",
    excerpt:
      "React Server Components represent a fundamental shift in how we build React applications. In this deep-dive, we'll explore what they are, how they work, and why they matter for the future of web development.",
    category: "web-dev",
    subcategory: "react",
    gradient: "from-cyan-400 to-blue-500",
    publishedAt: "February 28th, 2024",
    readingTime: "30 min read",
    likes: 72891,
    featured: false,
    tags: ["react", "rsc", "nextjs"],
  },
  {
    id: 7,
    slug: "css-animations-spring-physics",
    title: "CSS Animations with Spring Physics",
    subtitle: "Creating natural motion with linear()",
    excerpt:
      "The linear() timing function is a game-changer; it allows us to model physics-based motion right in vanilla CSS! Let's explore how to create bouncy, spring-like animations that feel alive.",
    category: "web-dev",
    subcategory: "animation",
    gradient: "from-emerald-400 to-green-500",
    publishedAt: "January 20th, 2024",
    readingTime: "16 min read",
    likes: 45623,
    featured: false,
    tags: ["css", "animation", "spring"],
  },
  // AI Posts
  {
    id: 8,
    slug: "building-with-llms",
    title: "Building Applications with LLMs",
    subtitle: "A practical guide for developers",
    excerpt:
      "Large Language Models are transforming how we build software. In this comprehensive guide, we'll explore practical patterns for integrating LLMs into your applications, from prompt engineering to RAG architectures.",
    category: "ai",
    subcategory: "llms",
    gradient: "from-cyan-400 to-blue-600",
    publishedAt: "July 1st, 2025",
    readingTime: "28 min read",
    likes: 52341,
    featured: true,
    tags: ["llm", "gpt", "ai"],
  },
  {
    id: 9,
    slug: "prompt-engineering-mastery",
    title: "Prompt Engineering Mastery",
    subtitle: "Getting the best results from AI",
    excerpt:
      "The quality of your prompts directly determines the quality of AI outputs. Learn advanced prompting techniques that will dramatically improve your results when working with ChatGPT, Claude, and other LLMs.",
    category: "ai",
    subcategory: "prompting",
    gradient: "from-blue-500 to-indigo-600",
    publishedAt: "June 20th, 2025",
    readingTime: "20 min read",
    likes: 38756,
    featured: false,
    tags: ["prompting", "chatgpt", "ai"],
  },
  {
    id: 10,
    slug: "ai-powered-development",
    title: "AI-Powered Development Tools",
    subtitle: "Supercharging your workflow with AI",
    excerpt:
      "From GitHub Copilot to Cursor, AI tools are revolutionizing how developers write code. Let's explore the landscape of AI dev tools and how to integrate them effectively into your workflow.",
    category: "ai",
    subcategory: "ai-tools",
    gradient: "from-teal-400 to-cyan-500",
    publishedAt: "May 15th, 2025",
    readingTime: "14 min read",
    likes: 29834,
    featured: false,
    tags: ["ai-tools", "copilot", "productivity"],
  },
  {
    id: 11,
    slug: "machine-learning-for-web-devs",
    title: "Machine Learning for Web Developers",
    subtitle: "ML concepts you can actually use",
    excerpt:
      "You don't need a PhD to use machine learning in your projects. This tutorial covers practical ML concepts and tools that web developers can start using today, with no heavy math required.",
    category: "ai",
    subcategory: "machine-learning",
    gradient: "from-violet-400 to-purple-500",
    publishedAt: "April 5th, 2025",
    readingTime: "18 min read",
    likes: 21567,
    featured: false,
    tags: ["ml", "tensorflow", "ai"],
  },
];

// Popular content for sidebar/homepage
export const popularContent = [
  {
    title: "An Interactive Guide to Flexbox",
    slug: "interactive-guide-to-flexbox",
    category: "CSS",
    likes: 89234,
  },
  {
    title: "Making Sense of React Server Components",
    slug: "react-server-components",
    category: "React",
    likes: 72891,
  },
  {
    title: "Promises From The Ground Up",
    slug: "promises-from-ground-up",
    category: "JavaScript",
    likes: 61077,
  },
  {
    title: "Building Applications with LLMs",
    slug: "building-with-llms",
    category: "AI",
    likes: 52341,
  },
  {
    title: "CSS Animations with Spring Physics",
    slug: "css-animations-spring-physics",
    category: "Animation",
    likes: 45623,
  },
  {
    title: "Understanding Distributed Systems",
    slug: "understanding-distributed-systems",
    category: "System Design",
    likes: 42847,
  },
  {
    title: "Prompt Engineering Mastery",
    slug: "prompt-engineering-mastery",
    category: "AI",
    likes: 38756,
  },
  {
    title: "Database Sharding Explained",
    slug: "database-sharding-explained",
    category: "System Design",
    likes: 31256,
  },
  {
    title: "AI-Powered Development Tools",
    slug: "ai-powered-development",
    category: "AI",
    likes: 29834,
  },
  {
    title: "Microservices vs Monolith",
    slug: "microservices-vs-monolith",
    category: "System Design",
    likes: 28934,
  },
];

export const navLinks = [
  { name: "Latest", href: "/" },
  { name: "Blogs", href: "/blogs" },
  {
    name: "Portfolio",
    href: "https://kaushik-dutta.vercel.app/",
    target: "_blank",
  },
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
