'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Question } from '@/app/types/question';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Badge } from '@/app/components/ui/badge';

interface ProblemPanelProps {
    question: Question;
}

export function ProblemPanel({ question }: ProblemPanelProps) {
    return (
        <div className="h-full flex flex-col bg-background">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant={
                        question.difficulty === 'Easy' ? 'secondary' :
                            question.difficulty === 'Medium' ? 'default' : 'destructive'
                    }>
                        {question.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {question.companies.join(', ')}
                    </span>
                </div>
                <h1 className="text-xl font-bold">{question.title}</h1>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none pb-10">
                    <ReactMarkdown>{question.description}</ReactMarkdown>
                </div>
            </ScrollArea>
        </div>
    );
}
