import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState, Question } from '../types/question';
import { questions } from '../data/questions';

interface QuestionsState {
    questions: Question[];
    solvedQuestionIds: string[];
    filters: FilterState;

    // Actions
    setFilter: (key: keyof FilterState, value: any) => void;
    markAsSolved: (questionId: string) => void;
    resetFilters: () => void;
    getFilteredQuestions: () => Question[];
}

export const useQuestionsStore = create<QuestionsState>()(
    persist(
        (set, get) => ({
            questions: questions,
            solvedQuestionIds: [],
            filters: {
                difficulty: 'All',
                company: 'All',
                tags: [],
                searchQuery: '',
                status: 'All'
            },

            setFilter: (key, value) =>
                set((state) => ({
                    filters: { ...state.filters, [key]: value }
                })),

            markAsSolved: (id) =>
                set((state) => ({
                    solvedQuestionIds: [...new Set([...state.solvedQuestionIds, id])]
                })),

            resetFilters: () =>
                set({
                    filters: {
                        difficulty: 'All',
                        company: 'All',
                        tags: [],
                        searchQuery: '',
                        status: 'All'
                    }
                }),

            getFilteredQuestions: () => {
                const state = get();
                const { difficulty, company, status, searchQuery } = state.filters;

                return state.questions.filter(q => {
                    // Difficulty Filter
                    if (difficulty !== 'All' && q.difficulty !== difficulty) return false;

                    // Company Filter
                    if (company !== 'All' && !q.companies.includes(company)) return false;

                    // Search Query
                    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

                    // Status Filter
                    if (status === 'Solved' && !state.solvedQuestionIds.includes(q.id)) return false;
                    if (status === 'Unsolved' && state.solvedQuestionIds.includes(q.id)) return false;

                    return true;
                });
            }
        }),
        {
            name: 'questions-storage',
            partialize: (state) => ({ solvedQuestionIds: state.solvedQuestionIds }), // Only persist progress
        }
    )
);
