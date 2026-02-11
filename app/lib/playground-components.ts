import {
    Globe, Smartphone, Network, Shield, Server, Database,
    Zap, MessageSquare, Lock, TrendingUp, Activity, FileText,
    Container, Settings, Search, Bell, CreditCard, Cloud,
    Cpu, HardDrive, Folder, BarChart3, Package, GitBranch,
    Timer, RefreshCw, AlertCircle, CheckCircle, Eye, FileCode,
    Boxes, Cog, Layers, Workflow, LucideIcon
} from "lucide-react";

// Icon name to component mapping
export const iconMap: Record<string, LucideIcon> = {
    Globe,
    Smartphone,
    Network,
    Shield,
    Server,
    Database,
    Zap,
    MessageSquare,
    Lock,
    TrendingUp,
    Activity,
    FileText,
    Container,
    Settings,
    Search,
    Bell,
    CreditCard,
    Cloud,
    Cpu,
    HardDrive,
    Folder,
    BarChart3,
    Package,
    GitBranch,
    Timer,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Eye,
    FileCode,
    Boxes,
    Cog,
    Layers,
    Workflow,
};

export type ComponentDefinition = {
    id: string;
    name: string;
    iconName: string; // Changed from icon to iconName
    category: string;
    description?: string;
};

export type ComponentCategory = {
    name: string;
    id: string;
    components: ComponentDefinition[];
};

export const componentCategories: ComponentCategory[] = [
    {
        name: "CLIENT",
        id: "client",
        components: [
            { id: "client-web-mobile", name: "Client (Web / Mobile)", iconName: "Globe", category: "client", description: "Web or mobile client application" },
            { id: "mobile-app", name: "Mobile App", iconName: "Smartphone", category: "client", description: "Native mobile application" },
        ],
    },
    {
        name: "NETWORKING",
        id: "networking",
        components: [
            { id: "load-balancer", name: "Load Balancer", iconName: "Network", category: "networking", description: "Distributes traffic across servers" },
            { id: "api-gateway", name: "API Gateway", iconName: "Shield", category: "networking", description: "Single entry point for APIs" },
            { id: "reverse-proxy", name: "Reverse Proxy", iconName: "Server", category: "networking", description: "Forwards client requests to servers" },
            { id: "cdn", name: "CDN", iconName: "Cloud", category: "networking", description: "Content Delivery Network" },
            { id: "dns", name: "DNS", iconName: "Globe", category: "networking", description: "Domain Name System" },
        ],
    },
    {
        name: "APPLICATION",
        id: "application",
        components: [
            { id: "api-server", name: "API Server", iconName: "Server", category: "application", description: "Handles API requests" },
            { id: "microservices", name: "Microservices", iconName: "Boxes", category: "application", description: "Independent service components" },
            { id: "background-workers", name: "Background Workers", iconName: "Cpu", category: "application", description: "Async task processors" },
            { id: "scheduler", name: "Scheduler", iconName: "Timer", category: "application", description: "Job scheduling service" },
        ],
    },
    {
        name: "DATA STORAGE",
        id: "data-storage",
        components: [
            { id: "database", name: "Database", iconName: "Database", category: "data-storage", description: "Relational or NoSQL database" },
            { id: "object-storage", name: "Object Storage", iconName: "Package", category: "data-storage", description: "S3-like object storage" },
            { id: "file-storage", name: "File Storage", iconName: "Folder", category: "data-storage", description: "File system storage" },
            { id: "data-warehouse", name: "Data Warehouse", iconName: "HardDrive", category: "data-storage", description: "Analytics data warehouse" },
            { id: "data-lake", name: "Data Lake", iconName: "Layers", category: "data-storage", description: "Raw data storage" },
            { id: "backup-storage", name: "Backup Storage", iconName: "HardDrive", category: "data-storage", description: "Backup and recovery" },
        ],
    },
    {
        name: "CACHING",
        id: "caching",
        components: [
            { id: "cache", name: "Cache", iconName: "Zap", category: "caching", description: "In-memory cache (Redis, Memcached)" },
            { id: "cdn-cache", name: "CDN Cache", iconName: "Cloud", category: "caching", description: "Edge caching layer" },
        ],
    },
    {
        name: "ASYNC & MESSAGING",
        id: "async-messaging",
        components: [
            { id: "message-queue", name: "Message Queue", iconName: "MessageSquare", category: "async-messaging", description: "Async message queue (RabbitMQ, SQS)" },
            { id: "task-queue", name: "Task Queue", iconName: "FileText", category: "async-messaging", description: "Task queue system (Celery, Bull)" },
            { id: "pub-sub", name: "Pub-Sub System", iconName: "Workflow", category: "async-messaging", description: "Publish-subscribe messaging" },
            { id: "event-system", name: "Event System", iconName: "Activity", category: "async-messaging", description: "Event-driven architecture" },
        ],
    },
    {
        name: "SECURITY & ACCESS",
        id: "security-access",
        components: [
            { id: "auth-service", name: "Auth Service", iconName: "Lock", category: "security-access", description: "Authentication service" },
            { id: "rate-limiter", name: "Rate Limiter", iconName: "TrendingUp", category: "security-access", description: "API rate limiting" },
            { id: "firewall", name: "Firewall", iconName: "Shield", category: "security-access", description: "Network firewall" },
            { id: "waf", name: "WAF", iconName: "Shield", category: "security-access", description: "Web Application Firewall" },
            { id: "encryption-service", name: "Encryption Service", iconName: "Lock", category: "security-access", description: "Data encryption service" },
        ],
    },
    {
        name: "RELIABILITY & SCALING",
        id: "reliability-scaling",
        components: [
            { id: "auto-scaler", name: "Auto Scaler", iconName: "TrendingUp", category: "reliability-scaling", description: "Auto-scaling service" },
            { id: "health-check", name: "Health Check", iconName: "CheckCircle", category: "reliability-scaling", description: "Service health monitoring" },
            { id: "circuit-breaker", name: "Circuit Breaker", iconName: "AlertCircle", category: "reliability-scaling", description: "Fault tolerance pattern" },
            { id: "retry-logic", name: "Retry Logic", iconName: "RefreshCw", category: "reliability-scaling", description: "Automatic retry mechanism" },
            { id: "failover-system", name: "Failover System", iconName: "GitBranch", category: "reliability-scaling", description: "Automatic failover" },
        ],
    },
    {
        name: "OBSERVABILITY",
        id: "observability",
        components: [
            { id: "monitoring", name: "Monitoring", iconName: "Eye", category: "observability", description: "System monitoring (Prometheus, Datadog)" },
            { id: "logging", name: "Logging", iconName: "FileText", category: "observability", description: "Centralized logging (ELK, Splunk)" },
            { id: "tracing", name: "Tracing", iconName: "Activity", category: "observability", description: "Distributed tracing (Jaeger)" },
            { id: "alerting", name: "Alerting", iconName: "Bell", category: "observability", description: "Alert management (PagerDuty)" },
        ],
    },
    {
        name: "DEPLOYMENT & OPS",
        id: "deployment-ops",
        components: [
            { id: "ci-cd-pipeline", name: "CI/CD Pipeline", iconName: "GitBranch", category: "deployment-ops", description: "Continuous integration/deployment" },
            { id: "container-registry", name: "Container Registry", iconName: "Container", category: "deployment-ops", description: "Docker image registry" },
            { id: "orchestrator", name: "Orchestrator", iconName: "Boxes", category: "deployment-ops", description: "Container orchestration (Kubernetes)" },
            { id: "config-manager", name: "Config Manager", iconName: "Settings", category: "deployment-ops", description: "Configuration management" },
        ],
    },
    {
        name: "SEARCH & ANALYTICS",
        id: "search-analytics",
        components: [
            { id: "search-engine", name: "Search Engine", iconName: "Search", category: "search-analytics", description: "Full-text search (Elasticsearch)" },
            { id: "indexing-service", name: "Indexing Service", iconName: "FileCode", category: "search-analytics", description: "Data indexing service" },
            { id: "analytics-engine", name: "Analytics Engine", iconName: "BarChart3", category: "search-analytics", description: "Analytics processing" },
        ],
    },
    {
        name: "EXTERNAL SERVICES",
        id: "external-services",
        components: [
            { id: "notification-service", name: "Notification Service", iconName: "Bell", category: "external-services", description: "Email/SMS/Push notifications" },
            { id: "payment-gateway", name: "Payment Gateway", iconName: "CreditCard", category: "external-services", description: "Payment processing (Stripe, PayPal)" },
            { id: "third-party-apis", name: "Third Party APIs", iconName: "Cloud", category: "external-services", description: "External API integrations" },
        ],
    },
];

// Flatten all components for easy lookup
export const allComponents = componentCategories.flatMap(cat => cat.components);

// Get component by ID
export const getComponentById = (id: string): ComponentDefinition | undefined => {
    return allComponents.find(comp => comp.id === id);
};

// Get category by ID
export const getCategoryById = (id: string): ComponentCategory | undefined => {
    return componentCategories.find(cat => cat.id === id);
};

// Get icon component by name
export const getIconByName = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Server; // Default to Server icon if not found
};
