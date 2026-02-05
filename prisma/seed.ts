import { PrismaClient } from "@prisma/client";
// ⚠️ Update these paths to match where you saved your mock files!
import { blogPosts, mainCategories, siteConfig } from "../app/data/mock";
import { blogContent } from "../app/data/blogContent";

const prisma = new PrismaClient();

// Helper to clean date strings (e.g., "June 15th, 2024" -> "June 15 2024")
// This ensures Date.parse() works reliably across all environments
function parseDate(dateStr: string) {
  const cleanDate = dateStr.replace(/(st|nd|rd|th)/, "");
  return new Date(cleanDate);
}

async function main() {
  console.log("🌱 Starting Database Seed...");

  // ==========================================
  // 0. CLEANUP (The Fix)
  // ==========================================
  // We delete data in a specific order to avoid "Foreign Key" constraint errors.
  // (e.g., You can't delete a User if they still have Blog Posts).
  console.log("🧹 Clearing old data...");
  await prisma.post.deleteMany(); // Delete Posts first
  await prisma.subCategory.deleteMany(); // Then Subcategories
  await prisma.category.deleteMany(); // Then Categories
  await prisma.user.deleteMany(); // Finally, the Users
  await prisma.tag.deleteMany(); // And Tags
  console.log("✨ Database clean.");

  // ==========================================
  // 1. Create the Author (You)
  // ==========================================
  const author = await prisma.user.create({
    data: {
      email: "codewithkaushikdutta@gmail.com",
      name: siteConfig.name,
      role: "ADMIN",
      avatar: siteConfig.avatar.light,
      bio: siteConfig.tagline,
      password: "securepassword123",
    },
  });
  console.log(`👤 Author ensured: ${author.name}`);

  // ==========================================
  // 2. Create Categories & Subcategories
  // ==========================================
  for (const cat of mainCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        // Update visuals if they changed in mock data
        gradient: cat.gradient,
        icon: cat.icon,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        gradient: cat.gradient,
        icon: cat.icon,
      },
    });

    // Handle Subcategories
    for (const sub of cat.subcategories) {
      await prisma.subCategory.upsert({
        where: { slug: sub.slug },
        update: {},
        create: {
          name: sub.name,
          slug: sub.slug,
          categoryId: category.id,
        },
      });
    }
    console.log(`📂 Category ensured: ${cat.name}`);
  }

  // ==========================================
  // 3. Create Tags & Posts
  // ==========================================
  for (const post of blogPosts) {
    // A. Find the Database IDs for Category/Subcategory
    const category = await prisma.category.findUnique({
      where: { slug: post.category },
    });

    // Some posts might not have a subcategory, handle that gracefully
    let subcategoryId = null;
    if (post.subcategory) {
      const sub = await prisma.subCategory.findUnique({
        where: { slug: post.subcategory },
      });
      subcategoryId = sub?.id;
    }

    if (!category) {
      console.warn(
        `⚠️ Skipping post "${post.title}": Category "${post.category}" not found in DB.`,
      );
      continue;
    }

    // B. Get Rich Content
    // We access blogContent using the slug as the key
    // We cast to 'any' because the import structure might be inferred loosely
    const detailedData = (blogContent as any)[post.slug];
    const richContent = detailedData?.content || [];

    // C. Parse Metadata
    const readingTimeInt = parseInt(post.readingTime.split(" ")[0]) || 5;
    const publishedDate = parseDate(post.publishedAt);

    // D. Prepare Tags Logic
    // Prisma's "connectOrCreate" allows us to create tags on the fly if they don't exist
    const tagOperations = post.tags?.map((tagSlug) => ({
      where: { slug: tagSlug },
      create: {
        name: tagSlug.replace(/-/g, " "), // "system-design" -> "system design"
        slug: tagSlug,
      },
    }));

    // E. Upsert the Post
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        content: richContent,
        likes: post.likes,
        tags: {
          connectOrCreate: tagOperations,
        },
      },
      create: {
        title: post.title,
        subtitle: post.subtitle,
        slug: post.slug,
        excerpt: post.excerpt,
        readingTime: readingTimeInt,
        likes: post.likes,
        featured: post.featured,
        published: true,
        publishedAt: publishedDate,
        gradient: post.gradient,
        coverImage: detailedData?.coverImage || null, // If you add images later
        content: richContent, // Storing the JSON blocks

        // Relations
        authorId: author.id,
        categoryId: category.id,
        subcategoryId: subcategoryId,

        // Tags Relation
        tags: {
          connectOrCreate: tagOperations,
        },
      },
    });
    console.log(`📝 Post ensured: ${post.title}`);
  }

  console.log("✅ Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
