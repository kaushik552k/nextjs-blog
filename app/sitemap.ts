import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kaushikcodes.in';

    // Get all blog posts from the posts directory
    const postsDirectory = path.join(process.cwd(), 'posts');
    let blogPosts: MetadataRoute.Sitemap = [];

    try {
        const postFiles = fs.readdirSync(postsDirectory);
        blogPosts = postFiles
            .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
            .map(file => {
                const slug = file.replace(/\.mdx?$/, '');
                return {
                    url: `${baseUrl}/blog/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                };
            });
    } catch (error) {
        console.warn('Could not read posts directory for sitemap generation');
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/latest`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/playground`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...blogPosts,
    ];
}
