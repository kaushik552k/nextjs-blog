"use client";

import { useState, useEffect } from 'react';
import { X, Activity, Database, Server, Box, Calculator, Bell, Laptop, BoxSelect, Copy, Network, Package, CreditCard, ChevronRight, Clock, Cloud, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaygroundStore } from '@/app/store/playgroundStore';

type CustomComponentModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const availableIcons = [
    { name: 'Activity', icon: Activity },
    { name: 'Database', icon: Database },
    { name: 'Server', icon: Server },
    { name: 'Box', icon: Box },
    { name: 'Calculator', icon: Calculator },
    { name: 'Bell', icon: Bell },
    { name: 'Laptop', icon: Laptop },
    { name: 'BoxSelect', icon: BoxSelect },
    { name: 'Copy', icon: Copy },
    { name: 'Network', icon: Network },
    { name: 'Package', icon: Package },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'ChevronRight', icon: ChevronRight },
    { name: 'Clock', icon: Clock },
    { name: 'Cloud', icon: Cloud },
    { name: 'Grid', icon: Grid },
];

export default function CustomComponentModal({ isOpen, onClose }: CustomComponentModalProps) {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Activity');
    const { addCustomComponent } = usePlaygroundStore();

    // Auto-generate typeID from name (replace spaces with underscores)
    const typeId = name.trim().toLowerCase().replace(/\s+/g, '_');

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setName('');
            setSelectedIcon('Activity');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!name.trim()) {
            alert('Please enter a component name');
            return;
        }

        const component = {
            id: `custom_${typeId}_${Date.now()}`, // Unique ID with timestamp
            name: name.trim(),
            iconName: selectedIcon, // Changed from 'icon' to 'iconName' to match component structure
            typeId: typeId,
        };

        addCustomComponent(component);

        // Close modal (form will reset via useEffect)
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-md bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl shadow-2xl mx-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#3a3a3a]">
                        <h2 className="text-base sm:text-lg font-semibold text-white">Create Custom Component</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Custom Component"
                                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Type ID (Auto-generated, read-only) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                Type ID (Auto-generated)
                            </label>
                            <input
                                type="text"
                                value={typeId}
                                readOnly
                                placeholder="my_custom_component"
                                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-xs sm:text-sm text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                Automatically generated from name (spaces → underscores)
                            </p>
                        </div>


                        {/* Icon Selector */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                Icon
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {availableIcons.map((iconItem) => {
                                    const IconComponent = iconItem.icon;
                                    return (
                                        <button
                                            key={iconItem.name}
                                            onClick={() => setSelectedIcon(iconItem.name)}
                                            className={`
                                                aspect-square flex items-center justify-center rounded-lg border transition-all touch-manipulation relative group
                                                ${selectedIcon === iconItem.name
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                                    : 'border-[#3a3a3a] bg-[#0a0a0a] text-gray-400 hover:border-blue-400 hover:text-blue-400'
                                                }
                                            `}
                                            title={iconItem.name}
                                        >
                                            <IconComponent className={`
                                                w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110
                                            `} />
                                            {selectedIcon === iconItem.name && (
                                                <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50 pointer-events-none" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-[#3a3a3a]">
                        <button
                            onClick={onClose}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-[#2a2a2a] rounded-lg transition-colors touch-manipulation"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors touch-manipulation"
                        >
                            Save
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
