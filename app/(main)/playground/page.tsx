import { Metadata } from 'next';
import PlaygroundClient from '@/app/components/playground/PlaygroundClient';

export const metadata: Metadata = {
    title: 'System Design Playground | Interactive Diagram Builder',
    description: 'Build and visualize system architecture diagrams with our interactive playground. Drag-and-drop components, create custom elements, and export your designs.',
    keywords: ['system design', 'architecture diagram', 'playground', 'interactive', 'diagram builder'],
};

export default function PlaygroundPage() {
    return <PlaygroundClient />;
}
