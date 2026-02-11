"use client";

import { useState } from 'react';
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
    const [typeId, setTypeId] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Activity');
    const { addCustomComponent } = usePlaygroundStore();

    const handleSave = () => {
        if (!name.trim()) {
            alert('Please enter a component name');
            return;
        }

        const component = {
            id: typeId || `custom_${name.toLowerCase().replace(/\s+/g, '_')}`,
            name,
            icon: selectedIcon,
            typeId: typeId || `my_component_id`,
        };

        addCustomComponent(component);

        // Reset form
        setName('');
        setTypeId('');
        setSelectedIcon('Activity');
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
                    className="relative w-full max-w-md bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
                        <h2 className="text-lg font-semibold text-white">Create Custom Component</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Custom Component"
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Type ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type ID (Internal)
                            </label>
                            <input
                                type="text"
                                value={typeId}
                                onChange={(e) => setTypeId(e.target.value)}
                                placeholder="my_component_id"
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Icon Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        p-3 rounded-lg border-2 transition-all
                        ${selectedIcon === iconItem.name
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : 'border-[#3a3a3a] bg-[#0a0a0a] hover:border-blue-400'
                                                }
                      `}
                                        >
                                            <IconComponent className="w-6 h-6 text-gray-300 mx-auto" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 p-4 border-t border-[#3a3a3a]">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Save Component
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
