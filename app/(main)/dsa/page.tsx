"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Loader2, Search, Code2, ChevronUp,
  CheckCircle, Circle, BarChart2, ExternalLink, BookOpenCheck
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/app/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface Category { id: string; name: string; slug: string; }
interface DsaQuestion {
  id: string; title: string; description: string; shortAnswer: string;
  difficulty: string; category: Category; tags: string;
  solutionLink?: string; learningResource?: string;
  pythonCode?: string; javaCode?: string; jsCode?: string;
}
interface Pagination { total: number; page: number; limit: number; totalPages: number; }
interface Stats { total: number; easy: number; medium: number; hard: number; }

// ─── Helpers ────────────────────────────────────────────────────────
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
  
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-muted text-primary border border-border">
        {children}
      </code>
    );
  }

  return (
    <div className={cn("my-3 rounded-xl overflow-hidden border text-sm font-mono border-border bg-zinc-900")}>
      {lang && (
        <div className={cn("flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b bg-zinc-800 text-zinc-400 border-zinc-700")}>
          {lang}
        </div>
      )}
      <pre className="p-4 overflow-x-auto leading-relaxed text-zinc-200">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Expanded Answer panel ─────────────────────────────────────────────────────
function DsaAnswerPanel({ q }: { q: DsaQuestion }) {
  const defaultTab = q.pythonCode ? "python" : q.javaCode ? "java" : q.jsCode ? "javascript" : "explanation";
  
  return (
    <div className="px-6 py-5 border-t border-border bg-muted/20">
      
      {/* Question Description */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-primary" /> Problem Description
        </h4>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          <ReactMarkdown components={{ code: CodeBlock }}>{q.description}</ReactMarkdown>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
          {q.pythonCode && <TabsTrigger value="python">Python</TabsTrigger>}
          {q.javaCode && <TabsTrigger value="java">Java</TabsTrigger>}
          {q.jsCode && <TabsTrigger value="javascript">JavaScript</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="explanation" className="focus:outline-none">
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground p-4 bg-card rounded-xl border">
            <ReactMarkdown components={{ code: CodeBlock }}>{q.shortAnswer}</ReactMarkdown>
          </div>
        </TabsContent>
        
        {q.pythonCode && (
          <TabsContent value="python" className="focus:outline-none mt-0">
            <div className="rounded-xl overflow-hidden border text-sm font-mono border-border bg-zinc-900">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b bg-zinc-800 text-zinc-400 border-zinc-700">Python 3</div>
              <pre className="p-4 overflow-x-auto leading-relaxed text-zinc-200"><code>{q.pythonCode.replace(/<br>/g, '\n')}</code></pre>
            </div>
          </TabsContent>
        )}
        
        {q.javaCode && (
          <TabsContent value="java" className="focus:outline-none mt-0">
            <div className="rounded-xl overflow-hidden border text-sm font-mono border-border bg-zinc-900">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b bg-zinc-800 text-zinc-400 border-zinc-700">Java</div>
              <pre className="p-4 overflow-x-auto leading-relaxed text-zinc-200"><code>{q.javaCode.replace(/<br>/g, '\n')}</code></pre>
            </div>
          </TabsContent>
        )}

        {q.jsCode && (
          <TabsContent value="javascript" className="focus:outline-none mt-0">
            <div className="rounded-xl overflow-hidden border text-sm font-mono border-border bg-zinc-900">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b bg-zinc-800 text-zinc-400 border-zinc-700">JavaScript</div>
              <pre className="p-4 overflow-x-auto leading-relaxed text-zinc-200"><code>{q.jsCode.replace(/<br>/g, '\n')}</code></pre>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* External Links */}
      {(q.solutionLink || q.learningResource) && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-border/50">
          {q.solutionLink && (
            <a href={q.solutionLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> LeetCode Solution
            </a>
          )}
          {q.learningResource && (
            <a href={q.learningResource} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Study Material
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: number | undefined; color: string }) {
  return (
    <div className="flex-1 min-w-[120px] rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-bold", color)}>{value !== undefined ? value.toLocaleString() : "-"}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DsaPage() {
  const [questions, setQuestions] = useState<DsaQuestion[]>([]);
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

  useEffect(() => {
    fetch("/api/dsa/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(console.error);
    fetch("/api/dsa?stats=true")
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
      const res = await fetch("/api/dsa?" + params);
      const data = await res.json();
      if (data.data) { setQuestions(data.data); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, searchQuery, difficulty, category]);

  useEffect(() => { setPage(1); }, [searchQuery, difficulty, category]);
  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

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
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Code2 className="w-6 h-6 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Data Structures & Algorithms</h1>
        </div>
        <p className="text-muted-foreground ml-[3.25rem]">
          Master classic DSA problems with detailed explanations and multi-language solutions.
        </p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex flex-wrap gap-3 mb-8">
          <StatCard label="Total Problems" value={stats.total} color="text-foreground" />
          <StatCard label="Easy" value={stats.easy} color="text-emerald-400" />
          <StatCard label="Medium" value={stats.medium} color="text-amber-400" />
          <StatCard label="Hard" value={stats.hard} color="text-red-400" />
          <div className="flex-1 min-w-[120px] rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Solved</p>
            <p className="text-2xl font-bold text-indigo-400">{solved.size}</p>
          </div>
        </div>
      )}

      {/* Search + Difficulty filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="dsa-search"
            placeholder="Search problems by title, description, or tags..."
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <div className="flex gap-2 p-1 bg-card border rounded-lg">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", 
                difficulty === d ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category tag chips */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
        <button
          onClick={() => setCategory("All")}
          className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
            category === "All"
              ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-500/20"
              : "bg-muted/30 text-muted-foreground border-border hover:border-indigo-400 hover:text-indigo-400")}
        >
          All Topics
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize",
              category === c.id
                ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-500/20"
                : "bg-muted/30 text-muted-foreground border-border hover:border-indigo-400 hover:text-indigo-400")}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Results summary */}
      {!loading && pagination && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{pagination.total}</span> problems found
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <BarChart2 className="w-3.5 h-3.5" />
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      )}

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[2rem_1fr_7rem_8rem_3rem] gap-4 px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b mb-1 bg-card rounded-t-xl border-t border-x">
        <span>#</span>
        <span>Problem Title</span>
        <span>Difficulty</span>
        <span>Category</span>
        <span className="text-center">Done</span>
      </div>

      {/* Question list */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 border border-t-0 rounded-b-xl bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 border border-t-0 rounded-b-xl bg-card flex flex-col items-center gap-3">
            <Code2 className="w-10 h-10 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No problems found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-t-0 sm:border-t rounded-xl sm:rounded-none sm:rounded-b-xl overflow-hidden shadow-sm">
            {questions.map((q, i) => {
              const isOpen = expandedId === q.id;
              const isSolved = solved.has(q.id);
              const rowNum = (page - 1) * 10 + i + 1;
              return (
                <div key={q.id} className={cn("bg-card transition-colors duration-200", isOpen && "bg-muted/30")}>
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
                    <div className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_7rem_8rem_3rem] gap-4 items-center px-4 py-4 hover:bg-muted/40 transition-colors">
                      <span className="text-xs text-muted-foreground font-mono">{rowNum}</span>

                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn("font-semibold text-sm leading-snug transition-colors", isSolved ? "line-through text-muted-foreground" : "text-foreground", isOpen && "text-indigo-400")}>
                          {q.title}
                        </span>
                        {/* Tags below title on desktop, invisible on mobile if small */}
                        <div className="hidden sm:flex gap-1.5 mt-0.5 overflow-hidden">
                          {q.tags?.split(',').slice(0,3).map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground whitespace-nowrap">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                        {/* Mobile badges */}
                        <div className="flex gap-2 sm:hidden mt-1">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-semibold", diffColor(q.difficulty))}>
                            {normDiff(q.difficulty)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium capitalize border border-border px-2 py-0.5 rounded-full">{q.category?.name}</span>
                        </div>
                      </div>

                      {/* Desktop difficulty */}
                      <span className={cn("hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full border font-bold w-fit shadow-sm", diffColor(q.difficulty))}>
                        {normDiff(q.difficulty)}
                      </span>

                      {/* Desktop category */}
                      <span className="hidden sm:flex items-center text-xs font-medium text-muted-foreground capitalize truncate">
                        {q.category?.name || "General"}
                      </span>

                      {/* Solved toggle */}
                      <button
                        onClick={(e) => toggleSolved(q.id, e)}
                        className="hidden sm:flex justify-center text-muted-foreground hover:text-indigo-400 transition-all duration-200"
                        title={isSolved ? "Mark unsolved" : "Mark solved"}
                      >
                        {isSolved ? <CheckCircle className="w-5 h-5 text-indigo-500 fill-indigo-500/10" /> : <Circle className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded answer */}
                  {isOpen && <DsaAnswerPanel q={q} />}
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
            <Button id="dsa-prev" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="shadow-sm">
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
                  className={cn("w-9 px-0 shadow-sm", p === page && "bg-indigo-500 hover:bg-indigo-600 text-white")}
                >
                  {p}
                </Button>
              );
            })}
            <Button id="dsa-next" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="shadow-sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
