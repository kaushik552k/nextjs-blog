'use client';

import { useState } from 'react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/app/components/ui/resizable';
import { Question } from '@/app/types/question';
import { ProblemPanel } from './ProblemPanel';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackTests,
} from '@codesandbox/sandpack-react';
import { useQuestionsStore } from '@/app/store/questionsStore';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, CheckCircle, Play, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

interface WorkspaceProps {
    question: Question;
}

export function Workspace({ question }: WorkspaceProps) {
    const markAsSolved = useQuestionsStore((state) => state.markAsSolved);
    const [activeTab, setActiveTab] = useState<'preview' | 'tests'>('preview');

    const files: Record<string, any> = {
        '/App.js': question.starterCode,
        '/styles.css': `body { font-family: sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`,
    };

    if (question.testCode) {
        files['/App.test.js'] = question.testCode;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Workspace Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background z-10">
                <div className="flex items-center gap-4">
                    <Link href="/questions">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <span className="font-semibold">{question.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => markAsSolved(question.id)}
                        className="gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Solved
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <SandpackProvider
                    template="react"
                    files={files}
                    theme="dark"
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                        classes: {
                            "sp-wrapper": "h-full w-full",
                            "sp-layout": "h-full w-full",
                            "sp-stack": "h-full",
                        },
                    }}
                    customSetup={{
                        dependencies: {
                            "react": "^18.0.0",
                            "react-dom": "^18.0.0",
                            "react-scripts": "^5.0.0",
                            "@testing-library/react": "^14.0.0",
                            "@testing-library/jest-dom": "^5.16.5",
                        }
                    }}
                >
                    <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
                        {/* Left Panel: Problem Description */}
                        <ResizablePanel defaultSize={35} minSize={20}>
                            <ProblemPanel question={question} />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Right Panel: Code & Preview */}
                        <ResizablePanel defaultSize={65}>
                            <SandpackLayout className="h-full !rounded-none !border-0 flex flex-col">
                                <ResizablePanelGroup orientation="vertical">
                                    {/* Top: Editor */}
                                    <ResizablePanel defaultSize={60} minSize={20}>
                                        <SandpackCodeEditor
                                            showTabs
                                            showLineNumbers
                                            showInlineErrors
                                            wrapContent
                                            closableTabs
                                            showRunButton={false}
                                            className="h-full"
                                            style={{ height: '100%' }}
                                        />
                                    </ResizablePanel>

                                    <ResizableHandle withHandle />

                                    {/* Bottom: Preview / Tests */}
                                    <ResizablePanel defaultSize={40} minSize={20}>
                                        <div className="flex flex-col h-full bg-background">
                                            {/* Tabs Header */}
                                            <div className="flex items-center border-b px-2 bg-muted/20 min-h-[40px]">
                                                <button
                                                    onClick={() => setActiveTab('preview')}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
                                                        activeTab === 'preview'
                                                            ? "border-primary text-foreground"
                                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('tests')}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
                                                        activeTab === 'tests'
                                                            ? "border-primary text-foreground"
                                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <Play className="w-3.5 h-3.5" />
                                                    Tests
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 overflow-hidden relative">
                                                <div className={cn("absolute inset-0", activeTab === 'preview' ? 'z-10' : 'z-0')}>
                                                    <SandpackPreview
                                                        showNavigator
                                                        showRefreshButton
                                                        className="h-full"
                                                        style={{ height: '100%' }}
                                                    />
                                                </div>
                                                <div className={cn("absolute inset-0 bg-background", activeTab === 'tests' ? 'z-10' : 'z-0')}>
                                                    {question.testCode ? (
                                                        <SandpackTests
                                                            className="h-full"
                                                            style={{ height: '100%' }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                                                            <p>No tests available for this problem.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </SandpackLayout>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </SandpackProvider>
            </div>
        </div>
    );
}
