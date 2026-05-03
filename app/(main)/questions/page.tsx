'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQuestionsStore } from '@/app/store/questionsStore';
import { QuestionCard } from '@/app/components/questions/QuestionCard';
import { FilterSidebar } from '@/app/components/questions/FilterSidebar';
import { Button } from '@/app/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function QuestionsPage() {
    // Hydration fix for zustand persist
    const [mounted, setMounted] = useState(false);

    const questionsData = useQuestionsStore((state) => state.questions);
    const filters = useQuestionsStore((state) => state.filters);
    const solvedQuestionIds = useQuestionsStore((state) => state.solvedQuestionIds);

    const questions = useMemo(() => {
        const { difficulty, company, status, searchQuery } = filters;

        return questionsData.filter(q => {
            // Difficulty Filter
            if (difficulty !== 'All' && q.difficulty !== difficulty) return false;

            // Company Filter
            if (company !== 'All' && !q.companies.includes(company)) return false;

            // Search Query
            if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            // Status Filter
            if (status === 'Solved' && !solvedQuestionIds.includes(q.id)) return false;
            if (status === 'Unsolved' && solvedQuestionIds.includes(q.id)) return false;

            return true;
        });
    }, [questionsData, filters, solvedQuestionIds]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
                        Coding Challenges
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Master frontend interviews by solving real-world challenges from top tech companies.
                    </p>
                </div>
                <Button size="lg" className="hidden md:flex gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Suggest Question
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 lg:sticky lg:top-8 order-2 lg:order-1">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full order-1 lg:order-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">
                            {questions.length} {questions.length === 1 ? 'Result' : 'Results'}
                        </h2>
                        {/* Mobile Suggest Button */}
                        <Button size="sm" variant="outline" className="md:hidden gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Suggest
                        </Button>
                    </div>

                    {questions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {questions.map((q) => (
                                <QuestionCard key={q.id} question={q} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed flex flex-col items-center justify-center">
                            <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                                <PlusCircle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                            <p className="text-muted-foreground max-w-sm">
                                We couldn't find any questions matching your filters. Try adjusting them or search for something else.
                            </p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
