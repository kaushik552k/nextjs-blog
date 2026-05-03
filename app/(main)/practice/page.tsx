"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Loader2, Search, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, Circle, BarChart2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/app/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface Question {
  id: string; title: string; answer: string;
  difficulty: string; category: Category;
}
interface Pagination { total: number; page: number; limit: number; totalPages: number; }
interface Stats { total: number; easy: number; medium: number; hard: number; }

// ─── Difficulty helpers ────────────────────────────────────────────────────────
function normDiff(d: string) {
  const l = d.toLowerCase();
  if (l === "easy") return "Easy";
  if (l === "medium") return "Medium";
  return "Hard";
}

function diffColor(d: string) {
  const n = normDiff(d);
  if (n === "Easy") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (n === "Medium") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

// ─── Markdown Code block ───────────────────────────────────────────────────────
function CodeBlock({ inline, className, children }: any) {
  const lang = (className || "").replace("language-", "");
  const isTerminal = ["bash", "sh", "shell", "terminal", "zsh", "powershell"].includes(lang);

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-muted text-primary border border-border">
        {children}
      </code>
    );
  }

  return (
    <div className={cn("my-3 rounded-xl overflow-hidden border text-sm font-mono", isTerminal ? "border-green-800 bg-zinc-950" : "border-border bg-zinc-900")}>
      {lang && (
        <div className={cn("flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b", isTerminal ? "bg-green-950 text-green-400 border-green-800" : "bg-zinc-800 text-zinc-400 border-zinc-700")}>
          {isTerminal ? "$ terminal" : lang}
        </div>
      )}
      <pre className="p-4 overflow-x-auto leading-relaxed text-zinc-200">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Expanded Answer panel ─────────────────────────────────────────────────────
function AnswerPanel({ answer }: { answer: string }) {
  return (
    <div className="px-6 py-5 border-t border-border bg-muted/20">
      <div className="prose prose-sm dark:prose-invert max-w-none
        prose-headings:text-foreground prose-headings:font-bold
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-strong:text-foreground
        prose-li:text-muted-foreground prose-li:leading-relaxed
        prose-ul:my-2 prose-ol:my-2">
        <ReactMarkdown components={{ code: CodeBlock }}>
          {answer}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1 min-w-[120px] rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-bold", color)}>{value.toLocaleString()}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories + stats once
  useEffect(() => {
    fetch("/api/practice/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(console.error);
    fetch("/api/practice?stats=true")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: "10",
        query: searchQuery, difficulty, category,
      });
      const res = await fetch("/api/practice?" + params);
      const data = await res.json();
      if (data.data) { setQuestions(data.data); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, searchQuery, difficulty, category]);

  useEffect(() => { setPage(1); }, [searchQuery, difficulty, category]);
  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // Debounced search
  const handleSearch = (v: string) => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setSearchQuery(v), 300);
  };

  const toggleSolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSolved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-primary/10">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Interview Practice</h1>
        </div>
        <p className="text-muted-foreground ml-12">
          Browse, search, and master real interview questions across all topics.
        </p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex flex-wrap gap-3 mb-8">
          <StatCard label="Total Questions" value={stats.total} color="text-foreground" />
          <StatCard label="Easy" value={stats.easy} color="text-emerald-400" />
          <StatCard label="Medium" value={stats.medium} color="text-amber-400" />
          <StatCard label="Hard" value={stats.hard} color="text-red-400" />
          <div className="flex-1 min-w-[120px] rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Solved</p>
            <p className="text-2xl font-bold text-primary">{solved.size}</p>
          </div>
        </div>
      )}

      {/* Search + Difficulty filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="practice-search"
            placeholder="Search questions..."
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {difficulties.map((d) => (
            <Button
              key={d}
              id={"diff-" + d}
              size="sm"
              variant={difficulty === d ? "default" : "outline"}
              onClick={() => setDifficulty(d)}
              className="h-10"
            >
              {d}
            </Button>
          ))}
        </div>
      </div>

      {/* Category tag chips */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
        <button
          onClick={() => setCategory("All")}
          className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
            category === "All"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted/30 text-muted-foreground border-border hover:border-primary hover:text-primary")}
        >
          All Topics
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
              category === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/30 text-muted-foreground border-border hover:border-primary hover:text-primary")}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Results summary */}
      {!loading && pagination && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{pagination.total}</span> questions found
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart2 className="w-3.5 h-3.5" />
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      )}

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[2rem_1fr_7rem_8rem_3rem] gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b mb-1">
        <span>#</span>
        <span>Question</span>
        <span>Difficulty</span>
        <span>Category</span>
        <span className="text-center">Done</span>
      </div>

      {/* Question list */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-muted/10 flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No questions found</h3>
            <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border border rounded-xl overflow-hidden">
            {questions.map((q, i) => {
              const isOpen = expandedId === q.id;
              const isSolved = solved.has(q.id);
              const rowNum = (page - 1) * 10 + i + 1;
              return (
                <div key={q.id} className={cn("bg-card transition-colors", isOpen && "bg-muted/30")}>
                  {/* Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="w-full text-left cursor-pointer focus:outline-none"
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedId(isOpen ? null : q.id);
                      }
                    }}
                  >
                    <div className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_7rem_8rem_3rem] gap-4 items-center px-4 py-4 hover:bg-muted/20 transition-colors">
                      <span className="text-xs text-muted-foreground font-mono">{rowNum}</span>

                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn("font-semibold text-sm leading-snug", isSolved && "line-through text-muted-foreground")}>
                          {q.title}
                        </span>
                        {/* Mobile badges */}
                        <div className="flex gap-2 sm:hidden">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", diffColor(q.difficulty))}>
                            {normDiff(q.difficulty)}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">{q.category?.name}</span>
                        </div>
                      </div>

                      {/* Desktop difficulty */}
                      <span className={cn("hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full border font-semibold w-fit", diffColor(q.difficulty))}>
                        {normDiff(q.difficulty)}
                      </span>

                      {/* Desktop category */}
                      <span className="hidden sm:block text-xs text-muted-foreground capitalize truncate">
                        {q.category?.name || "General"}
                      </span>

                      {/* Solved toggle */}
                      <button
                        onClick={(e) => toggleSolved(q.id, e)}
                        className="hidden sm:flex justify-center text-muted-foreground hover:text-emerald-400 transition-colors"
                        title={isSolved ? "Mark unsolved" : "Mark solved"}
                      >
                        {isSolved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expand arrow indicator */}
                  {isOpen && (
                    <div className="flex justify-center pb-1">
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Expanded answer */}
                  {isOpen && <AnswerPanel answer={q.answer} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)}</span> of {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button id="practice-prev" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, idx) => {
              const p = Math.max(1, Math.min(page - 2, pagination.totalPages - 4)) + idx;
              return (
                <Button
                  key={p}
                  id={"page-" + p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="w-9 px-0"
                >
                  {p}
                </Button>
              );
            })}
            <Button id="practice-next" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
