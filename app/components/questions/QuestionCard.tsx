import Link from 'next/link';
import { Question } from '@/app/types/question';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useQuestionsStore } from '@/app/store/questionsStore';

interface QuestionCardProps {
    question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
    const solvedQuestionIds = useQuestionsStore((state) => state.solvedQuestionIds);
    const isSolved = solvedQuestionIds.includes(question.id);

    const difficultyColor = {
        Easy: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
        Medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
        Hard: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
    };

    return (
        <Link href={`/questions/${question.slug}`} className="block group h-full">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
                {isSolved && (
                    <div className="absolute top-0 right-0 p-2 bg-green-500/10 rounded-bl-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                )}
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                {question.title}
                            </CardTitle>
                            <div className="flex gap-2 flex-wrap items-center">
                                <Badge variant="secondary" className={difficultyColor[question.difficulty]}>
                                    {question.difficulty}
                                </Badge>
                                {question.companies.map((company) => (
                                    <Badge key={company} variant="outline" className="text-xs font-normal">
                                        {company}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        {question.tags.map((tag) => (
                            <span key={tag} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
