import { questions } from '@/app/data/questions';
import { Workspace } from '@/app/components/questions/Workspace';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return questions.map((question) => ({
        slug: question.slug,
    }));
}

export default async function QuestionPage({ params }: PageProps) {
    const { slug } = await params;
    const question = questions.find((q) => q.slug === slug);

    if (!question) {
        notFound();
    }

    return (
        <div className="h-screen bg-background">
            <Workspace question={question} />
        </div>
    );
}
