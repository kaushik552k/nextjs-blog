"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { getIconByName } from '@/app/lib/playground-components';

export type CustomNodeData = {
    label: string;
    iconName: string;
    type: string;
    description?: string;
};

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
    const Icon = getIconByName(data.iconName);

    return (
        <div
            className={`
        relative px-4 py-3 rounded-lg bg-[#1a1a1a] border-2 transition-all
        ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-[#3a3a3a]'}
        hover:border-blue-400 hover:shadow-md
        min-w-[120px] max-w-[180px]
      `}
        >
            {/* Connection Handles - Left and Right for horizontal flow */}

            {/* Left Handle (Input/Target) */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-4 h-4 !bg-blue-500 border-2 border-white !rounded-full hover:!w-5 hover:!h-5 hover:!bg-blue-400 transition-all"
                style={{
                    left: -8,
                    cursor: 'crosshair'
                }}
            />

            {/* Right Handle (Output/Source) */}
            <Handle
                type="source"
                position={Position.Right}
                className="w-4 h-4 !bg-blue-500 border-2 border-white !rounded-full hover:!w-5 hover:!h-5 hover:!bg-blue-400 transition-all"
                style={{
                    right: -8,
                    cursor: 'crosshair'
                }}
            />

            {/* Node Content */}
            <div className="flex flex-col items-center gap-2 text-center">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                </div>

                {/* Label */}
                <div className="text-xs font-medium text-white leading-tight">
                    {data.label}
                </div>

                {/* Type Badge */}
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {data.type}
                </div>
            </div>
        </div>
    );
}

export default memo(CustomNode);
