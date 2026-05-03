"use client";

import { usePlaygroundStore } from '@/app/store/playgroundStore';
import { getIconByName } from '@/app/lib/playground-components';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertiesPanel() {
    const { selectedNode, selectedEdge, updateNode, deleteNode, updateEdge, deleteEdge, setSelectedNode, setSelectedEdge } = usePlaygroundStore();

    // Show edge properties if edge is selected
    if (selectedEdge) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    className="w-full sm:w-80 md:w-80 bg-[#1a1a1a] border-l border-[#3a3a3a] flex flex-col h-full"
                >
                    {/* Header */}
                    <div className="p-3 sm:p-4 border-b border-[#3a3a3a]">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                            Connection Properties
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                            {selectedEdge.source} → {selectedEdge.target}
                        </p>
                    </div>

                    {/* Properties */}
                    <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
                        {/* Label Input */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                Connection Label
                            </label>
                            <input
                                type="text"
                                value={selectedEdge.data?.label || ''}
                                onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
                                placeholder="e.g., HTTP, gRPC, REST API"
                                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                Label will appear above the connection line
                            </p>
                        </div>

                        {/* Info */}
                        <div className="p-2.5 sm:p-3 bg-[#2a2a2a] rounded-lg">
                            <p className="text-[10px] sm:text-xs text-gray-400">
                                Click on the connection line to select it. You can add a label to describe the relationship between components.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 sm:p-4 border-t border-[#3a3a3a]">
                        <button
                            onClick={() => {
                                deleteEdge(selectedEdge.id);
                                setSelectedEdge(null);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors touch-manipulation"
                        >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm">Delete Connection</span>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Show node properties if node is selected
    if (!selectedNode) {
        return null; // Hide panel completely when nothing is selected
    }

    const handleLabelChange = (newLabel: string) => {
        updateNode(selectedNode.id, { label: newLabel });
    };

    const handleDescriptionChange = (newDescription: string) => {
        updateNode(selectedNode.id, { description: newDescription });
    };

    const handleDelete = () => {
        deleteNode(selectedNode.id);
        setSelectedNode(null);
    };

    const Icon = getIconByName(selectedNode.data.iconName);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                className="w-full sm:w-80 md:w-80 bg-[#1a1a1a] border-l border-[#3a3a3a] flex flex-col h-full"
            >
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-[#3a3a3a]">
                    <div className="flex items-center gap-2 mb-2">
                        {selectedNode.data.iconName && (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                            </div>
                        )}
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                            {selectedNode.data.label}
                        </h3>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
                        {selectedNode.data.type}
                    </p>
                </div>

                {/* Properties */}
                <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
                    {/* Label Input */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                            Label
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.label}
                            onChange={(e) => handleLabelChange(e.target.value)}
                            className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={selectedNode.data.description || ''}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            rows={3}
                            className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-xs sm:text-sm resize-none focus:outline-none focus:border-blue-500"
                            placeholder="Add a description..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="p-3 sm:p-4 border-t border-[#3a3a3a]">
                    <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors touch-manipulation"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Delete Component</span>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
