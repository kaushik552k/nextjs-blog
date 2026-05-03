export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionStatus = 'Solved' | 'Unsolved';

export interface TestCase {
  input: any[];
  expected: any;
}

export interface Question {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  companies: string[];
  description: string; // Markdown content
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  testCode?: string;
}

export interface FilterState {
  difficulty: Difficulty | 'All';
  company: string | 'All';
  tags: string[];
  searchQuery: string;
  status: QuestionStatus | 'All';
}
