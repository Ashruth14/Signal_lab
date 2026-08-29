import {
  FeedbackItem,
  ProblemCluster,
  FeatureRequest,
  StrategicInsight,
  ProductRequirement,
  ProductFeature,
  RoadmapEpic,
  ResearchSession,
  UXFinding,
  UserPersona,
  DesignValidationSession,
  DesignToken,
  FigmaFrameSpec,
  DesignReviewThread,
  DevTask,
  SprintFeature,
  SandboxBuild,
  QATestCase,
  BugItem,
  ReleaseReadinessCheck,
  ReleaseItem,
  IncidentItem,
  MaintenanceTask,
  ContextBlock,
  SecondBrainNote,
  FileVaultItem,
  ProjectDecision,
  ProjectMetrics,
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
  ProjectWorkspace,
  LLMModelTarget,
} from '../types';

export const initialMetrics: ProjectMetrics = {
  compositeHealth: 100,
  userSentimentScore: 100,
  checkoutReliability: 100,
  featureVelocity: 0,
  uxHealthScore: 100,
  qaPassRate: 100,
  productionHealth: 100,
  activeP0Issues: 0,
  openPRDCount: 0,
  unresolvedVisualMismatches: 0,
  unrefinedNotesCount: 0,
  securityHealthScore: 100,
  openVulnerabilitiesCount: 0,
  criticalVulnerabilitiesCount: 0,
};

export const initialFeedback: FeedbackItem[] = [];
export const initialProblemClusters: ProblemCluster[] = [];
export const initialFeatureRequests: FeatureRequest[] = [];
export const initialInsights: StrategicInsight[] = [];

export const initialPRDs: ProductRequirement[] = [];
export const initialFeatures: ProductFeature[] = [];
export const initialRoadmap: RoadmapEpic[] = [];

export const initialResearchSessions: ResearchSession[] = [];
export const initialUXFindings: UXFinding[] = [];
export const initialPersonas: UserPersona[] = [];

export const initialValidationSessions: DesignValidationSession[] = [];
export const initialDesignTokens: DesignToken[] = [];
export const initialFigmaSpecs: FigmaFrameSpec[] = [];
export const initialDesignReviews: DesignReviewThread[] = [];

export const initialDevTasks: DevTask[] = [];
export const initialSprintFeatures: SprintFeature[] = [];
export const initialSandboxBuilds: SandboxBuild[] = [];

export const initialQATestCases: QATestCase[] = [];
export const initialBugItems: BugItem[] = [];
export const initialReadinessChecks: ReleaseReadinessCheck[] = [];

export const initialReleases: ReleaseItem[] = [];
export const initialIncidents: IncidentItem[] = [];
export const initialMaintenance: MaintenanceTask[] = [];

export const initialContextBlocks: ContextBlock[] = [];
export const initialSecondBrainNotes: SecondBrainNote[] = [];
export const initialFileVault: FileVaultItem[] = [];
export const initialDecisions: ProjectDecision[] = [];

export const initialSecurityAssessments: SecurityAssessment[] = [];
export const initialSecurityFindings: SecurityFinding[] = [];
export const initialSecurityEvidence: SecurityEvidence[] = [];
export const initialSecurityScanEvents: SecurityScanEvent[] = [];

export const initialWorkspaces: ProjectWorkspace[] = [
  {
    id: 'ws-default',
    name: 'Primary Workspace',
    code: 'MAIN',
    tagline: 'Connect a GitHub repository to ingest project memory',
    description: 'Workspace ready. Import a GitHub repository to automatically parse codebase intelligence, synthesize PRDs, Kanban tasks, and security audits.',
    version: 'v1.0.0',
    platform: 'Cross-Platform',
    healthScore: 100,
    activeSprint: 'Sprint 1: Repository Ingestion & Baseline Architecture',
    createdAt: new Date().toISOString().split('T')[0],
    owner: 'Project Maintainer',
    techStack: ['TypeScript', 'React', 'Node.js'],
    themeColor: '#0070f3',
  },
];

// LLM models & pricing metadata
export const initialLLMModels: LLMModelTarget[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet (Thinking)',
    provider: 'anthropic',
    providerName: 'Anthropic',
    contextWindow: 200000,
    inputCostPerMillionUSD: 3.00,
    outputCostPerMillionUSD: 15.00,
    inputCostPerMillionINR: 255.00,
    outputCostPerMillionINR: 1275.00,
    supportsReasoning: true,
    strengths: 'Hybrid reasoning with native extended thinking, complex architectural refactoring, and strict XML adherence.',
    tag: 'Recommended',
    formatStyle: 'xml-claude',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    providerName: 'Anthropic',
    contextWindow: 200000,
    inputCostPerMillionUSD: 3.00,
    outputCostPerMillionUSD: 15.00,
    inputCostPerMillionINR: 255.00,
    outputCostPerMillionINR: 1275.00,
    supportsReasoning: false,
    strengths: 'Industry-leading frontend UI precision, artifact generation, and zero-hallucination code generation.',
    tag: 'Zero Hallucination',
    formatStyle: 'xml-claude',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openai',
    providerName: 'OpenAI',
    contextWindow: 128000,
    inputCostPerMillionUSD: 2.50,
    outputCostPerMillionUSD: 10.00,
    inputCostPerMillionINR: 212.50,
    outputCostPerMillionINR: 850.00,
    supportsReasoning: false,
    strengths: 'Balanced multimodal intelligence, JSON schema enforcement, and rapid response latency.',
    tag: 'High Speed',
    formatStyle: 'json-schema-openai',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    contextWindow: 200000,
    inputCostPerMillionUSD: 1.10,
    outputCostPerMillionUSD: 4.40,
    inputCostPerMillionINR: 93.50,
    outputCostPerMillionINR: 374.00,
    supportsReasoning: true,
    strengths: 'High-speed reasoning specialized for STEM, complex algorithmic invariants, and unit test suites.',
    tag: 'Reasoning',
    formatStyle: 'json-schema-openai',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    providerName: 'Google DeepMind',
    contextWindow: 1000000,
    inputCostPerMillionUSD: 0.10,
    outputCostPerMillionUSD: 0.40,
    inputCostPerMillionINR: 8.50,
    outputCostPerMillionINR: 34.00,
    supportsReasoning: false,
    strengths: '1 Million token context window, ultra-low cost, and blazing fast latency for massive codebase ingestion.',
    tag: 'High Speed',
    formatStyle: 'system-gemini',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    contextWindow: 64000,
    inputCostPerMillionUSD: 0.55,
    outputCostPerMillionUSD: 2.19,
    inputCostPerMillionINR: 46.75,
    outputCostPerMillionINR: 186.15,
    supportsReasoning: true,
    strengths: 'Open-weight deep reasoning, transparent mathematical verification, and rigorous AST logic checks.',
    tag: 'Reasoning',
    formatStyle: 'cot-deepseek',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'meta',
    providerName: 'Meta AI',
    contextWindow: 128000,
    inputCostPerMillionUSD: 0.35,
    outputCostPerMillionUSD: 0.40,
    inputCostPerMillionINR: 29.75,
    outputCostPerMillionINR: 34.00,
    supportsReasoning: false,
    strengths: 'High performance open-source enterprise model, lightweight tokens, and deterministic formatting.',
    tag: 'Open Source',
    formatStyle: 'compact-llama',
  },
];
