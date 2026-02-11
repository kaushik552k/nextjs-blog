import { Metadata } from 'next';
import PlaygroundClient from '@/app/components/playground/PlaygroundClient';

export const metadata: Metadata = {
    title: 'System Design Playground | Interactive Diagram Builder',
    description: 'Build and visualize system architecture diagrams with Kaushik Codes interactive playground. Drag-and-drop components, create custom elements, and export your designs as PNG or JSON.',
    keywords: [
        'system design',
        'architecture diagram',
        'playground',
        'interactive',
        'diagram builder',
        'kaushik codes',
        'system design tool',
        'architecture visualization',
        'drag and drop diagram'
    ],
    openGraph: {
        title: 'System Design Playground | Kaushik Codes',
        description: 'Build and visualize system architecture diagrams with our interactive playground. Drag-and-drop components, create custom elements, and export your designs.',
        url: 'https://kaushikcodes.in/playground',
        type: 'website',
        images: [
            {
                url: '/playground-og.jpg',
                width: 1200,
                height: 630,
                alt: 'System Design Playground by Kaushik Codes'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'System Design Playground | Kaushik Codes',
        description: 'Build and visualize system architecture diagrams with our interactive playground.',
        images: ['/playground-og.jpg'],
    },
    alternates: {
        canonical: 'https://kaushikcodes.in/playground',
    },
};

export default function PlaygroundPage() {
    return <PlaygroundClient />;
}
