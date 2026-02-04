export const blogContent: any = {
  "understanding-distributed-systems": {
    title: "Understanding Distributed Systems",
    subtitle: "A visual guide to building resilient architectures",
    author: "Kaushik Dutta",
    publishedAt: "June 15th, 2024",
    updatedAt: "July 2nd, 2025",
    category: "System Design",
    subcategory: "Distributed Systems",
    readingTime: "18 min read",
    content: [
      {
        type: "paragraph",
        content:
          "Distributed systems are everywhere. Every time you send a message, make a purchase online, or stream a video, you're interacting with distributed systems.",
      },
      {
        type: "heading",
        level: 2,
        content: "What is a Distributed System?",
      },
      {
        type: "paragraph",
        content:
          "A distributed system is a collection of independent computers that appears to its users as a single coherent system.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Key Insight",
        content:
          "The goal of a distributed system is to provide a unified experience while leveraging the power of multiple machines.",
      },
      {
        type: "code",
        language: "javascript",
        filename: "distributed-example.js",
        content: `// Simple example of distributed processing
async function processRequest(userId) {
  // Request might be handled by any server in the cluster
  const userData = await cache.get(userId);
  return userData;
}`,
      },
    ],
  },
  "promises-from-ground-up": {
    title: "Promises From The Ground Up",
    subtitle: "Building deep intuition for async JavaScript",
    author: "Kaushik Dutta",
    publishedAt: "June 3rd, 2024",
    category: "Web Dev",
    subcategory: "JavaScript",
    readingTime: "22 min read",
    content: [
      {
        type: "paragraph",
        content:
          "There are a lot of speed bumps and potholes on the road to JavaScript proficiency. One of the biggest and most daunting is Promises.",
      },
      {
        type: "heading",
        level: 2,
        content: "Why would they design it this way??",
      },
      {
        type: "code",
        language: "javascript",
        filename: "async-await.js",
        content: `async function countdown() {
  console.log("5…");
  await wait(1000);
  console.log("Happy New Year!");
}`,
      },
    ],
  },
};

export default blogContent;
