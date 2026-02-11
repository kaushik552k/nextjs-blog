"use client";

import { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { componentCategories, getIconByName } from '@/app/lib/playground-components';
import CustomComponentModal from './CustomComponentModal';

export default function ComponentLibrary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(componentCategories.map(cat => cat.id))
    );
    const [showCustomModal, setShowCustomModal] = useState(false);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const onDragStart = (event: React.DragEvent, component: any) => {
        event.dataTransfer.setData(
            'application/reactflow',
            JSON.stringify(component)
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    // Filter components based on search
    const filteredCategories = componentCategories.map(category => ({
        ...category,
        components: category.components.filter(comp =>
            comp.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(cat => cat.components.length > 0);

    return (
        <>
            <div className="w-64 bg-[#1a1a1a] border-r border-[#3a3a3a] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-[#3a3a3a]">
                    <h2 className="text-lg font-bold text-white mb-1">
                        System Design
                    </h2>
                    <p className="text-xs text-blue-400 uppercase tracking-wide">
                        PLAYGROUND
                    </p>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-[#3a3a3a]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Create Component Button */}
                <div className="p-3 border-b border-[#3a3a3a]">
                    <button
                        onClick={() => setShowCustomModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Create Component</span>
                    </button>
                </div>

                {/* Component Categories */}
                <div className="flex-1 overflow-y-auto">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="border-b border-[#3a3a3a]">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                                        {category.name}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {category.components.length}
                                </span>
                            </button>

                            {/* Components */}
                            <AnimatePresence>
                                {expandedCategories.has(category.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {category.components.map((component) => {
                                            const Icon = getIconByName(component.iconName);
                                            return (
                                                <div
                                                    key={component.id}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, component)}
                                                    className="flex items-center gap-3 px-4 py-2 ml-6 hover:bg-[#2a2a2a] cursor-move transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                        <Icon className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                                        {component.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Component Modal */}
            <CustomComponentModal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
            />
        </>
    );
}
