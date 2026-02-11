"use client";

import { ReactFlowProvider } from 'reactflow';
import SystemDesignPlayground from './SystemDesignPlayground';

export default function PlaygroundClient() {
    return (
        <ReactFlowProvider>
            <SystemDesignPlayground />
        </ReactFlowProvider>
    );
}
