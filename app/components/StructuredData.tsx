'use client';

interface StructuredDataProps {
    type: 'person' | 'website' | 'article' | 'breadcrumb';
    data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    let schema = {};

    switch (type) {
        case 'person':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Kaushik Dutta',
                alternateName: 'Kaushik Codes',
                url: 'https://kaushikcodes.in',
                jobTitle: 'Software Engineer',
                description: 'Software engineer and tech writer specializing in web development, system design, and AI',
                sameAs: [
                    // Add your social media profiles here
                    'https://github.com/kaushik552k',
                    'https://linkedin.com/in/kaushikdutta',
                    'https://twitter.com/kaushikcodes',
                ],
            };
            break;

        case 'website':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Kaushik Codes',
                alternateName: 'Kaushik Dutta Blog',
                url: 'https://kaushikcodes.in',
                description: 'A digital garden featuring tutorials on web development, system design, AI, and coding best practices',
                author: {
                    '@type': 'Person',
                    name: 'Kaushik Dutta',
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://kaushikcodes.in/search?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                },
            };
            break;

        case 'article':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: data?.title || '',
                description: data?.description || '',
                image: data?.image || 'https://kaushikcodes.in/og-image.jpg',
                datePublished: data?.publishedDate || new Date().toISOString(),
                dateModified: data?.modifiedDate || new Date().toISOString(),
                author: {
                    '@type': 'Person',
                    name: 'Kaushik Dutta',
                    url: 'https://kaushikcodes.in',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Kaushik Codes',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://kaushikcodes.in/logo.png',
                    },
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': data?.url || 'https://kaushikcodes.in',
                },
            };
            break;

        case 'breadcrumb':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: data?.items || [],
            };
            break;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
