import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import html2canvas from 'html2canvas';

export type CustomComponent = {
    id: string;
    name: string;
    icon: string;
    typeId: string;
};

type PlaygroundState = {
    nodes: Node[];
    edges: Edge[];
    selectedNode: Node | null;
    selectedEdge: Edge | null;
    customComponents: CustomComponent[];

    // Actions
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    updateNode: (id: string, data: Partial<Node['data']>) => void;
    deleteNode: (id: string) => void;
    updateEdge: (id: string, data: Partial<Edge['data']>) => void;
    deleteEdge: (id: string) => void;
    setSelectedNode: (node: Node | null) => void;
    setSelectedEdge: (edge: Edge | null) => void;
    addCustomComponent: (component: CustomComponent) => void;

    // Persistence
    loadFromStorage: () => void;
    saveToStorage: () => void;

    // Export/Import
    exportToJSON: () => string;
    exportToPNG: (element: HTMLElement) => Promise<void>;
    importFromJSON: (json: string) => void;
    clearCanvas: () => void;
};

const STORAGE_KEY = 'playground_diagram';
const CUSTOM_COMPONENTS_KEY = 'playground_custom_components';

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedEdge: null,
    customComponents: [],

    setNodes: (nodes) => {
        set({ nodes });
        get().saveToStorage();
    },

    setEdges: (edges) => {
        set({ edges });
        get().saveToStorage();
    },

    addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }));
        get().saveToStorage();
    },

    updateNode: (id, data) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            ),
        }));
        get().saveToStorage();
    },

    deleteNode: (id) => {
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
            selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
        }));
        get().saveToStorage();
    },

    updateEdge: (id, data) => {
        set((state) => {
            const updatedEdges = state.edges.map((edge) =>
                edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
            );
            const updatedSelectedEdge = state.selectedEdge?.id === id
                ? { ...state.selectedEdge, data: { ...state.selectedEdge.data, ...data } }
                : state.selectedEdge;

            return {
                edges: updatedEdges,
                selectedEdge: updatedSelectedEdge,
            };
        });
        get().saveToStorage();
    },

    deleteEdge: (id) => {
        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
            selectedEdge: state.selectedEdge?.id === id ? null : state.selectedEdge,
        }));
        get().saveToStorage();
    },

    setSelectedNode: (node) => set({ selectedNode: node, selectedEdge: null }),

    setSelectedEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),

    addCustomComponent: (component) => {
        set((state) => ({
            customComponents: [...state.customComponents, component],
        }));
        // Save custom components separately
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                CUSTOM_COMPONENTS_KEY,
                JSON.stringify(get().customComponents)
            );
        }
    },

    loadFromStorage: () => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { nodes, edges } = JSON.parse(saved);
                // Validate nodes have proper position objects
                const validNodes = (nodes || []).filter((node: Node) =>
                    node.position &&
                    typeof node.position.x === 'number' &&
                    typeof node.position.y === 'number'
                );
                set({ nodes: validNodes, edges: edges || [] });
            }

            const customComponents = localStorage.getItem(CUSTOM_COMPONENTS_KEY);
            if (customComponents) {
                set({ customComponents: JSON.parse(customComponents) });
            }
        } catch (error) {
            console.error('Failed to load from storage:', error);
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY);
            set({ nodes: [], edges: [] });
        }
    },

    saveToStorage: () => {
        if (typeof window === 'undefined') return;

        try {
            const { nodes, edges } = get();
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ nodes, edges })
            );
        } catch (error) {
            console.error('Failed to save to storage:', error);
        }
    },

    exportToJSON: () => {
        const { nodes, edges, customComponents } = get();
        const data = {
            version: '1.0',
            nodes,
            edges,
            customComponents,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
        return JSON.stringify(data, null, 2);
    },

    exportToPNG: async (element) => {
        try {
            const canvas = await html2canvas(element, {
                background: '#0a0a0a',
                logging: false, // Suppress console warnings about unsupported colors
                ignoreElements: (el: Element) => {
                    // Skip elements that might have problematic colors
                    return el.classList?.contains('react-flow__controls') ||
                        el.classList?.contains('react-flow__minimap');
                },
            } as any);

            const link = document.createElement('a');
            link.download = `system-design-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Export to PNG failed:', error);
            alert('Failed to export diagram. Please try again.');
        }
    },

    importFromJSON: (json) => {
        try {
            const data = JSON.parse(json);

            if (data.nodes) set({ nodes: data.nodes });
            if (data.edges) set({ edges: data.edges });

            // Merge custom components (avoid duplicates)
            if (data.customComponents) {
                set((state) => {
                    const existingIds = new Set(state.customComponents.map(c => c.id));
                    const newComponents = data.customComponents.filter(
                        (c: CustomComponent) => !existingIds.has(c.id)
                    );
                    return {
                        customComponents: [...state.customComponents, ...newComponents],
                    };
                });
            }

            get().saveToStorage();
        } catch (error) {
            console.error('Failed to import JSON:', error);
            throw error;
        }
    },

    clearCanvas: () => {
        set({ nodes: [], edges: [], selectedNode: null });
        get().saveToStorage();
    },
}));
