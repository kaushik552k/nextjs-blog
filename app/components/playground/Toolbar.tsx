"use client";

import { RefObject, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, Upload, Trash2 } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { usePlaygroundStore } from '@/app/store/playgroundStore';
import { motion, AnimatePresence } from 'framer-motion';

type ToolbarProps = {
    canvasRef: RefObject<HTMLDivElement | null>;
};

export default function Toolbar({ canvasRef }: ToolbarProps) {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const { exportToJSON, exportToPNG, importFromJSON, clearCanvas } = usePlaygroundStore();
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleExportJSON = () => {
        const json = exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `system-design-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const handleExportPNG = async () => {
        try {
            // Get the React Flow viewport element (the actual canvas with nodes)
            const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
            if (!viewportElement) {
                alert('Unable to find diagram canvas');
                return;
            }

            // Hide controls and minimap temporarily
            const controls = document.querySelector('.react-flow__controls') as HTMLElement;
            const minimap = document.querySelector('.react-flow__minimap') as HTMLElement;
            const originalControlsDisplay = controls?.style.display;
            const originalMinimapDisplay = minimap?.style.display;

            if (controls) controls.style.display = 'none';
            if (minimap) minimap.style.display = 'none';

            // Use dom-to-image-more which handles modern CSS better than html2canvas
            const domtoimage = (await import('dom-to-image-more')).default;

            // Export only the viewport (nodes and edges)
            const dataUrl = await domtoimage.toPng(viewportElement, {
                bgcolor: '#0a0a0a',
                style: {
                    transform: 'none', // Remove any transforms for clean export
                },
            });

            // Restore controls and minimap
            if (controls) controls.style.display = originalControlsDisplay || '';
            if (minimap) minimap.style.display = originalMinimapDisplay || '';

            const link = document.createElement('a');
            link.download = `system-design-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            setShowExportMenu(false);
        } catch (error) {
            console.error('Export failed:', error);

            // Restore controls and minimap in case of error
            const controls = document.querySelector('.react-flow__controls') as HTMLElement;
            const minimap = document.querySelector('.react-flow__minimap') as HTMLElement;
            if (controls) controls.style.display = '';
            if (minimap) minimap.style.display = '';

            alert('Failed to export diagram. Please try again.');
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = event.target?.result as string;
                    importFromJSON(json);
                } catch (error) {
                    console.error('Import failed:', error);
                    alert('Failed to import file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
            clearCanvas();
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-lg p-1">
                <button
                    onClick={() => zoomOut()}
                    className="p-1.5 hover:bg-[#3a3a3a] rounded transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4 text-gray-300" />
                </button>
                <span className="px-2 text-sm text-gray-300 min-w-[45px] text-center">100%</span>
                <button
                    onClick={() => zoomIn()}
                    className="p-1.5 hover:bg-[#3a3a3a] rounded transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4 text-gray-300" />
                </button>
            </div>

            {/* Reset View */}
            <button
                onClick={() => fitView()}
                className="p-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
                title="Reset"
            >
                <Maximize2 className="w-4 h-4 text-gray-300" />
            </button>

            {/* Export */}
            <div className="relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 rounded-lg transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                </button>

                <AnimatePresence>
                    {showExportMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 right-0 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg overflow-hidden z-50"
                        >
                            <button
                                onClick={handleExportJSON}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                            >
                                Export as JSON
                            </button>
                            <button
                                onClick={handleExportPNG}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                            >
                                Export as PNG
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Import */}
            <button
                onClick={handleImport}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 rounded-lg transition-colors"
            >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Import</span>
            </button>

            {/* Clear */}
            <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] hover:bg-red-600/20 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Clear</span>
            </button>
        </div>
    );
}
