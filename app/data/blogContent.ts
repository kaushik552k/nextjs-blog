// Full blog post content in MDX-like format
// Each post contains structured content with components

export const BACKUP_blogContent = {
  "understanding-distributed-systems": {
    title: "Understanding Distributed Systems",
    subtitle: "A visual guide to building resilient architectures",
    author: "Josh W Comeau",
    publishedAt: "June 15th, 2024",
    updatedAt: "July 2nd, 2025",
    category: "System Design",
    subcategory: "Distributed Systems",
    readingTime: "18 min read",
    content: [
      {
        type: "paragraph",
        content:
          'Distributed systems are everywhere. Every time you send a message, make a purchase online, or stream a video, you\'re interacting with distributed systems. But what exactly makes a system "distributed", and why should you care?',
      },
      {
        type: "heading",
        level: 2,
        content: "What is a Distributed System?",
      },
      {
        type: "paragraph",
        content:
          'A distributed system is a collection of independent computers that appears to its users as a single coherent system. The key word here is "appears" – the complexity of multiple machines working together is hidden from the end user.',
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
  
  if (!userData) {
    // Fetch from primary database
    const data = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    await cache.set(userId, data);
    return data;
  }
  
  return userData;
}`,
      },
      {
        type: "heading",
        level: 2,
        content: "The CAP Theorem",
      },
      {
        type: "paragraph",
        content:
          "One of the most fundamental concepts in distributed systems is the CAP theorem. It states that a distributed system can only provide two of three guarantees: Consistency, Availability, and Partition tolerance.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Important Trade-off",
        content:
          "In practice, network partitions are inevitable, so you're really choosing between Consistency and Availability during a partition.",
      },
      {
        type: "heading",
        level: 2,
        content: "Consensus Algorithms",
      },
      {
        type: "paragraph",
        content:
          "When multiple nodes need to agree on a value, we use consensus algorithms. The most famous ones include Paxos and Raft. These algorithms ensure that even if some nodes fail, the system can still make progress.",
      },
      {
        type: "code",
        language: "javascript",
        filename: "raft-simplified.js",
        content: `// Simplified Raft leader election
class RaftNode {
  constructor(id, peers) {
    this.id = id;
    this.peers = peers;
    this.state = 'follower';
    this.term = 0;
    this.votedFor = null;
  }
  
  startElection() {
    this.state = 'candidate';
    this.term++;
    this.votedFor = this.id;
    
    const votes = 1; // Vote for self
    // Request votes from peers...
  }
}`,
      },
      {
        type: "heading",
        level: 2,
        content: "Wrapping Up",
      },
      {
        type: "paragraph",
        content:
          "Distributed systems are complex, but understanding the fundamentals – CAP theorem, consensus, and replication – gives you a solid foundation for designing scalable applications. In future posts, we'll dive deeper into specific patterns and implementations.",
      },
    ],
  },

  "promises-from-ground-up": {
    title: "Promises From The Ground Up",
    subtitle: "Building deep intuition for async JavaScript",
    author: "Josh W Comeau",
    publishedAt: "June 3rd, 2024",
    updatedAt: "March 18th, 2025",
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
        type: "paragraph",
        content:
          "In order to understand Promises, we need a surprisingly deep understanding of how JavaScript works and what its limitations are. Without that context, Promises won't really make much sense.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why This Matters",
        content:
          "The Promises API is so important nowadays. It's become the de facto way of working with asynchronous code. Modern web APIs are built on top of Promises.",
      },
      {
        type: "heading",
        level: 2,
        content: "Why would they design it this way??",
      },
      {
        type: "paragraph",
        content:
          "Suppose we wanted to build a Happy New Year! countdown. If JavaScript was like most other programming languages, we could solve the problem like this:",
      },
      {
        type: "code",
        language: "javascript",
        filename: "hypothetical.js",
        content: `function newYearsCountdown() {
  print("3");
  sleep(1000);

  print("2");
  sleep(1000);

  print("1");
  sleep(1000);

  print("Happy New Year! 🎉");
}`,
      },
      {
        type: "paragraph",
        content:
          'Unfortunately, there is no sleep function in JavaScript, because it\'s a single-threaded language. A "thread" is a long-running process that executes code. JavaScript only has one thread, and so it can only do one thing at a time.',
      },
      {
        type: "heading",
        level: 2,
        content: "Callbacks",
      },
      {
        type: "paragraph",
        content:
          "The main tool in our toolbox for solving these sorts of problems is setTimeout. It accepts a chunk of work to do and the amount of time to wait for.",
      },
      {
        type: "code",
        language: "javascript",
        filename: "callback-hell.js",
        content: `console.log("3…");

setTimeout(() => {
  console.log("2…");

  setTimeout(() => {
    console.log("1…");

    setTimeout(() => {
      console.log("Happy New Year!!");
    }, 1000);
  }, 1000);
}, 1000);`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Callback Hell",
        content:
          "This pattern of nested callbacks was so common (and problematic) that we gave it a name: Callback Hell. Promises were developed to solve these problems.",
      },
      {
        type: "heading",
        level: 2,
        content: "Introducing Promises",
      },
      {
        type: "paragraph",
        content:
          "Instead of nesting, what if we could chain them together? This is the core idea behind Promises. A Promise is a special construct, added to JavaScript in 2015.",
      },
      {
        type: "code",
        language: "javascript",
        filename: "promise-chain.js",
        content: `function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

wait(1000)
  .then(() => {
    console.log('2');
    return wait(1000);
  })
  .then(() => {
    console.log('1');
    return wait(1000);
  })
  .then(() => {
    console.log('Happy New Year!!');
  });`,
      },
      {
        type: "heading",
        level: 2,
        content: "Async / Await",
      },
      {
        type: "paragraph",
        content:
          "One of the really great parts of modern JavaScript is the async/await syntax. Using this syntax, we can get pretty darn close to our ideal countdown structure:",
      },
      {
        type: "code",
        language: "javascript",
        filename: "async-await.js",
        content: `async function countdown() {
  console.log("5…");
  await wait(1000);

  console.log("4…");
  await wait(1000);

  console.log("3…");
  await wait(1000);

  console.log("2…");
  await wait(1000);

  console.log("1…");
  await wait(1000);

  console.log("Happy New Year!");
}`,
      },
      {
        type: "callout",
        variant: "success",
        title: "The Magic of async/await",
        content:
          "Promises give JavaScript the underlying infrastructure it needed to provide syntax that looks and feels synchronous, while actually being asynchronous under the hood. It's pretty friggin' great.",
      },
    ],
  },

  "building-with-llms": {
    title: "Building Applications with LLMs",
    subtitle: "A practical guide for developers",
    author: "Josh W Comeau",
    publishedAt: "July 1st, 2025",
    category: "AI",
    subcategory: "LLMs & GPT",
    readingTime: "28 min read",
    content: [
      {
        type: "paragraph",
        content:
          "Large Language Models have fundamentally changed how we think about building software. But despite all the hype, there's surprisingly little practical guidance on how to actually integrate LLMs into production applications.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What We'll Cover",
        content:
          "This guide focuses on practical patterns: prompt engineering, context management, RAG architectures, and error handling. No theoretical fluff – just real-world techniques you can use today.",
      },
      {
        type: "heading",
        level: 2,
        content: "Understanding the LLM API",
      },
      {
        type: "paragraph",
        content:
          "At its core, working with an LLM is straightforward: you send a prompt, you get a response. But the devil is in the details. Let's look at a basic integration:",
      },
      {
        type: "code",
        language: "javascript",
        filename: "basic-llm.js",
        content: `import OpenAI from 'openai';

const openai = new OpenAI();

async function generateResponse(userMessage) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });
  
  return completion.choices[0].message.content;
}`,
      },
      {
        type: "heading",
        level: 2,
        content: "Prompt Engineering Patterns",
      },
      {
        type: "paragraph",
        content:
          "The quality of your prompts directly determines the quality of your outputs. Here are some patterns that consistently produce better results:",
      },
      {
        type: "code",
        language: "javascript",
        filename: "structured-prompt.js",
        content: `const systemPrompt = \`
You are an expert code reviewer. Your task is to analyze code 
and provide constructive feedback.

## Guidelines:
- Focus on correctness, performance, and readability
- Be specific about issues and provide examples
- Suggest improvements, don't just criticize
- Rate severity: Critical, Warning, or Suggestion

## Output Format:
Respond in JSON with this structure:
{
  "summary": "Brief overview",
  "issues": [
    {
      "severity": "Warning",
      "line": 42,
      "description": "...",
      "suggestion": "..."
    }
  ],
  "score": 85
}
\`;`,
      },
      {
        type: "callout",
        variant: "success",
        title: "Pro Tip",
        content:
          "Always specify your output format explicitly. JSON schemas, markdown templates, or clear examples help the LLM produce consistently structured responses.",
      },
      {
        type: "heading",
        level: 2,
        content: "RAG: Retrieval-Augmented Generation",
      },
      {
        type: "paragraph",
        content:
          "LLMs have knowledge cutoffs and can't access your specific data. RAG solves this by retrieving relevant context before generating a response:",
      },
      {
        type: "code",
        language: "javascript",
        filename: "rag-example.js",
        content: `async function ragQuery(userQuestion) {
  // 1. Convert question to embedding
  const embedding = await getEmbedding(userQuestion);
  
  // 2. Search vector database for relevant docs
  const relevantDocs = await vectorDB.search(embedding, {
    topK: 5,
    threshold: 0.7
  });
  
  // 3. Build context from retrieved documents
  const context = relevantDocs
    .map(doc => doc.content)
    .join('\\n\\n');
  
  // 4. Generate response with context
  return generateResponse(\`
    Context:\n\${context}\n\n
    Question: \${userQuestion}\n
    Answer based only on the provided context.
  \`);
}`,
      },
      {
        type: "heading",
        level: 2,
        content: "Handling Errors Gracefully",
      },
      {
        type: "paragraph",
        content:
          "LLM APIs can fail for many reasons: rate limits, timeouts, invalid responses. Robust error handling is essential for production applications.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Always Have a Fallback",
        content:
          "Never let an LLM failure crash your application. Implement graceful degradation, retry logic, and meaningful error messages for users.",
      },
    ],
  },
};

export default BACKUP_blogContent;
