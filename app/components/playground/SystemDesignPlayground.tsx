"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Node,
    Edge,
    Connection,
    addEdge,
    useNodesState,
    useEdgesState,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    NodeTypes,
    useReactFlow,
    EdgeProps,
    getBezierPath,
    EdgeLabelRenderer,
    BaseEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Menu, X } from 'lucide-react';
import { usePlaygroundStore } from '@/app/store/playgroundStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import ComponentLibrary from './ComponentLibrary';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    default: CustomEdge,
};

export default function SystemDesignPlayground() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const {
        nodes: storeNodes,
        edges: storeEdges,
        setNodes: setStoreNodes,
        setEdges: setStoreEdges,
        setSelectedNode,
        setSelectedEdge,
        loadFromStorage,
        selectedNode,
        selectedEdge,
    } = usePlaygroundStore();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Auto-show right sidebar when node/edge is selected
    useEffect(() => {
        if (selectedNode || selectedEdge) {
            setShowRightSidebar(true);
        }
    }, [selectedNode, selectedEdge]);

    // Load from storage on mount
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    // Sync with store (always sync when store changes)
    useEffect(() => {
        setNodes(storeNodes);
    }, [storeNodes, setNodes]);

    useEffect(() => {
        setEdges(storeEdges);
    }, [storeEdges, setEdges]);

    // Handle node changes - NO save during drag
    const handleNodesChange: OnNodesChange = useCallback(
        (changes) => {
            onNodesChange(changes);
        },
        [onNodesChange]
    );

    // Handle edge changes
    const handleEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            onEdgesChange(changes);
        },
        [onEdgesChange]
    );

    // Save to store only when drag stops - use React Flow's getNodes()
    const onNodeDragStop = useCallback(
        () => {
            const currentNodes = reactFlowInstance.getNodes();
            setStoreNodes(currentNodes);
        },
        [reactFlowInstance, setStoreNodes]
    );

    // Handle connections
    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            const newEdge = {
                ...connection,
                id: `e${connection.source}-${connection.target}-${Date.now()}`,
                animated: true,
                style: { stroke: '#3b82f6', strokeWidth: 2 },
                data: { label: '' },
            };
            const updatedEdges = addEdge(newEdge, edges);
            setEdges(updatedEdges);
            setStoreEdges(updatedEdges);
        },
        [setEdges, setStoreEdges, edges]
    );

    // Handle node selection
    const onNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            setSelectedNode(node);
        },
        [setSelectedNode]
    );

    // Handle edge selection
    const onEdgeClick = useCallback(
        (_event: React.MouseEvent, edge: Edge) => {
            setSelectedEdge(edge);
        },
        [setSelectedEdge]
    );

    // Handle pane click (deselect)
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }, [setSelectedNode, setSelectedEdge]);

    // Handle drop from component library
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = canvasRef.current?.getBoundingClientRect();
            if (!reactFlowBounds) return;

            const componentData = event.dataTransfer.getData('application/reactflow');
            if (!componentData) return;

            const component = JSON.parse(componentData);

            // Get the position relative to the React Flow viewport
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: `${component.id}-${Date.now()}`,
                type: 'custom',
                position,
                data: {
                    label: component.name,
                    iconName: component.iconName,
                    type: component.category,
                    description: component.description || '',
                },
            };

            const updatedNodes = [...reactFlowInstance.getNodes(), newNode];
            setNodes(updatedNodes);
            setStoreNodes(updatedNodes);
        },
        [reactFlowInstance, setNodes, setStoreNodes]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div className="h-screen w-screen flex bg-[#0a0a0a] fixed inset-0">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white hover:bg-[#2a2a2a] transition-colors"
                aria-label="Toggle menu"
            >
                {showLeftSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Left Sidebar - Component Library (Full Height) */}
            <div className={`
                ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                fixed lg:relative
                z-40 lg:z-auto
                transition-transform duration-300 ease-in-out
                h-full
            `}>
                <ComponentLibrary />
            </div>

            {/* Mobile Overlay */}
            {showLeftSidebar && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setShowLeftSidebar(false)}
                />
            )}

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Toolbar - Centered and Floating */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-auto max-w-[calc(100vw-2rem)]">
                    <Toolbar canvasRef={canvasRef} />
                </div>

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onNodeDragStop={onNodeDragStop}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodesDraggable={true}
                        fitView={false}
                        className="bg-[#0a0a0a]"
                        defaultEdgeOptions={{
                            animated: true,
                            style: { stroke: '#3b82f6', strokeWidth: 2 },
                        }}
                        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
                        connectionRadius={40}
                        minZoom={0.1}
                        maxZoom={4}
                        snapToGrid={false}
                        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    >
                        <Background color="#333" gap={16} />
                    </ReactFlow>
                </div>

                {/* Right Sidebar - Properties Panel */}
                <div className={`
                    ${showRightSidebar && (selectedNode || selectedEdge) ? 'translate-x-0' : 'translate-x-full'}
                    lg:translate-x-0
                    fixed lg:absolute
                    right-0 top-0 bottom-0
                    z-40 lg:z-auto
                    transition-transform duration-300 ease-in-out
                `}>
                    <PropertiesPanel />
                </div>

                {/* Right Sidebar Mobile Overlay */}
                {showRightSidebar && (selectedNode || selectedEdge) && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setShowRightSidebar(false)}
                    />
                )}
            </div>
        </div>
    );
}
