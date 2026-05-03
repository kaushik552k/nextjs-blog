'use client';

import { useQuestionsStore } from '@/app/store/questionsStore';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Search, X } from 'lucide-react';
import { Difficulty, QuestionStatus } from '@/app/types/question';

export function FilterSidebar() {
    const { filters, setFilter, resetFilters } = useQuestionsStore();

    const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
    const companies = ['Meta', 'Google', 'Amazon', 'Uber', 'Airbnb'];
    const statuses: QuestionStatus[] = ['Solved', 'Unsolved'];

    return (
        <div className="space-y-8 w-full lg:w-72 shrink-0 p-1">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs h-8 text-muted-foreground hover:text-foreground"
                >
                    Reset All
                </Button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search title..."
                            value={filters.searchQuery}
                            onChange={(e) => setFilter('searchQuery', e.target.value)}
                            className="pl-9"
                        />
                        {filters.searchQuery && (
                            <button
                                onClick={() => setFilter('searchQuery', '')}
                                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <div className="flex flex-wrap gap-2">
                        {difficulties.map((diff) => {
                            const isActive = filters.difficulty === diff;
                            return (
                                <Badge
                                    key={diff}
                                    variant={isActive ? "default" : "outline"}
                                    className={`cursor-pointer px-3 py-1.5 ${!isActive ? 'hover:bg-accent' : ''}`}
                                    onClick={() => setFilter('difficulty', isActive ? 'All' : diff)}
                                >
                                    {diff}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => {
                            const isActive = filters.status === status;
                            return (
                                <Badge
                                    key={status}
                                    variant={isActive ? "secondary" : "outline"}
                                    className={`cursor-pointer px-3 py-1.5 ${!isActive ? 'hover:bg-accent' : ''}`}
                                    onClick={() => setFilter('status', isActive ? 'All' : status)}
                                >
                                    {status}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                {/* Companies */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Companies</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {companies.map((company) => {
                            const isActive = filters.company === company;
                            return (
                                <div
                                    key={company}
                                    className={`
                      text-sm px-3 py-2 rounded-md cursor-pointer border transition-colors
                      ${isActive
                                            ? 'bg-primary/10 border-primary text-primary font-medium'
                                            : 'bg-background border-border hover:border-primary/50'
                                        }
                    `}
                                    onClick={() => setFilter('company', isActive ? 'All' : company)}
                                >
                                    {company}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
