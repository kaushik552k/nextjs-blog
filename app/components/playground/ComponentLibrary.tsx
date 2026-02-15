"use client";

import { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { componentCategories, getIconByName } from '@/app/lib/playground-components';
import { usePlaygroundStore } from '@/app/store/playgroundStore';
import CustomComponentModal from './CustomComponentModal';

export default function ComponentLibrary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set([...componentCategories.map(cat => cat.id), 'custom']) // Include 'custom' by default
    );
    const [showCustomModal, setShowCustomModal] = useState(false);
    const { customComponents, deleteCustomComponent } = usePlaygroundStore();

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

    const handleDeleteCustomComponent = (e: React.MouseEvent, componentId: string) => {
        e.stopPropagation(); // Prevent drag from starting
        if (confirm('Are you sure you want to delete this custom component?')) {
            deleteCustomComponent(componentId);
        }
    };

    // Filter standard components based on search
    const filteredCategories = componentCategories.map(category => ({
        ...category,
        components: category.components.filter(comp =>
            comp.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(cat => cat.components.length > 0);

    // Filter custom components based on search
    const filteredCustomComponents = customComponents.filter(comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="w-full sm:w-72 md:w-64 bg-[#1a1a1a] border-r border-[#3a3a3a] flex flex-col h-full">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-[#3a3a3a]">
                    <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                        System Design
                    </h2>
                    <p className="text-[10px] sm:text-xs text-blue-400 uppercase tracking-wide">
                        PLAYGROUND
                    </p>
                </div>

                {/* Search */}
                <div className="p-2 sm:p-3 border-b border-[#3a3a3a]">
                    <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Create Component Button */}
                <div className="p-2 sm:p-3 border-b border-[#3a3a3a]">
                    <button
                        onClick={() => setShowCustomModal(true)}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors touch-manipulation"
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">Create Component</span>
                    </button>
                </div>

                {/* Component Categories */}
                <div className="flex-1 overflow-y-auto">
                    {/* Custom Components Category - Only show if there are custom components */}
                    {filteredCustomComponents.length > 0 && (
                        <div className="border-b border-[#3a3a3a]">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory('custom')}
                                className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 hover:bg-[#2a2a2a] transition-colors touch-manipulation bg-gradient-to-r from-blue-900/20 to-transparent"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {expandedCategories.has('custom') ? (
                                        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                    ) : (
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                    )}
                                    <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wide">
                                        Custom Components
                                    </span>
                                </div>
                                <span className="text-[10px] sm:text-xs text-blue-400">
                                    {filteredCustomComponents.length}
                                </span>
                            </button>

                            {/* Custom Components */}
                            <AnimatePresence>
                                {expandedCategories.has('custom') && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {filteredCustomComponents.map((component) => {
                                            const Icon = getIconByName(component.iconName);
                                            return (
                                                <div
                                                    key={component.id}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, component)}
                                                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 ml-4 sm:ml-6 hover:bg-[#2a2a2a] cursor-move transition-colors group touch-manipulation relative"
                                                >
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                                                        {component.name}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleDeleteCustomComponent(e, component.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all flex-shrink-0"
                                                        title="Delete component"
                                                    >
                                                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Standard Component Categories */}
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="border-b border-[#3a3a3a]">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 hover:bg-[#2a2a2a] transition-colors touch-manipulation"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                    )}
                                    <span className="text-[10px] sm:text-xs font-semibold text-gray-300 uppercase tracking-wide">
                                        {category.name}
                                    </span>
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500">
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
                                                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 ml-4 sm:ml-6 hover:bg-[#2a2a2a] cursor-move transition-colors group touch-manipulation"
                                                >
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
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
