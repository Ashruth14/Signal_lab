import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Milestone,
  Layers,
  FileText,
  MessageSquare,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Microscope,
  Eye,
  Users,
  CheckCircle,
  Palette,
  Sparkles,
  MessageSquareMore,
  Kanban,
  GitBranch,
  Terminal,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Server,
  RadioTower,
  Database,
  BookOpen,
  FolderOpen,
  Scale,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { NavSection, RoleType } from '../../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  roles: RoleType[];
  items: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeVariant?: 'terracotta' | 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'neutral';
    isSignature?: boolean;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeSection,
    setActiveSection,
    activeRole,
    isSidebarOpen,
    setSidebarOpen,
    problemClusters,
    validationSessions,
    secondBrainNotes,
    bugs,
    qaTestCases,
    securityFindings,
    activeWorkspace,
  } = useProject();

  // Dynamic Badges Calculations
  const criticalClusterCount = problemClusters.filter((c) => c.severity === 'critical' && c.status !== 'resolved').length;
  const totalPins = validationSessions.reduce((sum, s) => sum + s.annotations.filter((a) => !a.resolved).length, 0);
  const unrefinedNotes = secondBrainNotes.filter((n) => !n.isRefined).length;
  const openBugsCount = bugs.filter((b) => b.status !== 'Verified Resolved').length;
  const failedQACount = qaTestCases.filter((tc) => tc.status === 'Failed').length;
  const criticalSecCount = securityFindings.filter(
    (f) => f.severity === 'critical' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  ).length;

  const navGroups: NavGroup[] = [
    // 1. Executive & Overview (Shown for 'all' and 'pm')
    {
      id: 'group-executive',
      label: 'Executive & Overview',
      roles: ['all', 'pm'],
      items: [
        { id: 'overview', label: 'Executive Health Pulse', icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: 'product-health', label: 'Product Health Radar', icon: <Activity className="h-4 w-4" /> },
        { id: 'roadmap', label: 'Strategic Roadmap', icon: <Milestone className="h-4 w-4" /> },
      ],
    },

    // 2. Product Management (Shown for 'all' and 'pm')
    {
      id: 'group-pm',
      label: 'Product Management',
      roles: ['all', 'pm'],
      items: [
        { id: 'features', label: 'Features Directory', icon: <Layers className="h-4 w-4" /> },
        { id: 'requirements', label: 'Requirements & PRD Hub', icon: <FileText className="h-4 w-4" />, badge: '4 PRDs', badgeVariant: 'terracotta' },
      ],
    },

    // 3. User Intelligence & Feedback (Shown for 'all' and 'pm')
    {
      id: 'group-feedback',
      label: 'User Intelligence Hub',
      roles: ['all', 'pm'],
      items: [
        { id: 'feedback', label: 'Feedback Stream', icon: <MessageSquare className="h-4 w-4" /> },
        {
          id: 'user-issues',
          label: 'AI Problem Clusters',
          icon: <AlertTriangle className="h-4 w-4" />,
          badge: criticalClusterCount > 0 ? `${criticalClusterCount} P0 Crash` : undefined,
          badgeVariant: 'red',
        },
        { id: 'feature-requests', label: 'Feature Requests', icon: <Flame className="h-4 w-4" /> },
        { id: 'insights', label: 'Strategic AI Insights', icon: <BrainCircuit className="h-4 w-4" />, badge: 'AI', badgeVariant: 'amber' },
      ],
    },

    // 4. UX Research & Patterns (Shown for 'all' and 'designer')
    {
      id: 'group-ux',
      label: 'UX Research & Patterns',
      roles: ['all', 'designer'],
      items: [
        { id: 'research', label: 'Interview Sessions', icon: <Microscope className="h-4 w-4" /> },
        { id: 'findings', label: 'UX Findings & Friction', icon: <Eye className="h-4 w-4" /> },
        { id: 'user-patterns', label: 'Personas & Patterns', icon: <Users className="h-4 w-4" /> },
      ],
    },

    // 5. Design & Validation Studio (Shown for 'all' and 'designer')
    {
      id: 'group-design',
      label: 'Design & Validation',
      roles: ['all', 'designer'],
      items: [
        {
          id: 'validation',
          label: 'Validation Studio',
          icon: <CheckCircle className="h-4 w-4" />,
          isSignature: true,
          badge: totalPins > 0 ? `${totalPins} Pins` : 'Spec Sync',
          badgeVariant: 'amber',
        },
        { id: 'designs', label: 'Design Token Library', icon: <Palette className="h-4 w-4" /> },
        { id: 'figma', label: 'Figma Specs Inspector', icon: <Sparkles className="h-4 w-4" /> },
        { id: 'reviews', label: 'Design Review Threads', icon: <MessageSquareMore className="h-4 w-4" /> },
      ],
    },

    // 6. Developer Workspace (Shown for 'all' and 'dev')
    {
      id: 'group-dev',
      label: 'Developer Workspace',
      roles: ['all', 'dev'],
      items: [
        { id: 'tasks', label: 'Developer Kanban', icon: <Kanban className="h-4 w-4" /> },
        { id: 'dev-features', label: 'Sprint & PR Tracker', icon: <GitBranch className="h-4 w-4" /> },
        { id: 'builds', label: 'Sandbox Builds & CI', icon: <Terminal className="h-4 w-4" /> },
        { id: 'prompts', label: 'AI Prompt Builder', icon: <Zap className="h-4 w-4" />, badge: 'Zero Hallucination', badgeVariant: 'terracotta' },
      ],
    },

    // 7. Engineering Architecture & Context (Shown for 'all' and 'dev')
    {
      id: 'group-dev-context',
      label: 'Engineering Architecture',
      roles: ['all', 'dev'],
      items: [
        {
          id: 'validation',
          label: 'Code vs Figma Specs',
          icon: <CheckCircle className="h-4 w-4" />,
          isSignature: true,
          badge: 'Spec Sync',
          badgeVariant: 'amber',
        },
        { id: 'context', label: 'System Context Blocks', icon: <BookOpen className="h-4 w-4" /> },
      ],
    },

    // 8. QA & Security Gating (Shown for 'all' and 'qa')
    {
      id: 'group-qa',
      label: 'QA & Security Gating',
      roles: ['all', 'qa'],
      items: [
        {
          id: 'security',
          label: 'Autonomous Security Hub',
          icon: <ShieldAlert className="h-4 w-4 text-[#ee0000]" />,
          badge: criticalSecCount > 0 ? `${criticalSecCount} Critical` : 'Passed',
          badgeVariant: criticalSecCount > 0 ? 'red' : 'green',
        },
        {
          id: 'qa-status',
          label: 'Acceptance Test Matrix',
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: failedQACount > 0 ? `${failedQACount} Failing` : 'Passed',
          badgeVariant: failedQACount > 0 ? 'red' : 'green',
        },
        {
          id: 'bugs',
          label: 'Bug Tracker',
          icon: <ShieldAlert className="h-4 w-4" />,
          badge: openBugsCount > 0 ? `${openBugsCount} Open` : undefined,
          badgeVariant: 'red',
        },
        { id: 'release-readiness', label: 'Release Readiness Gate', icon: <Gauge className="h-4 w-4" />, badge: '88% Score', badgeVariant: 'amber' },
      ],
    },

    // 9. Production & Ops (Shown for 'all' and 'ops')
    {
      id: 'group-ops',
      label: 'Production & Ops',
      roles: ['all', 'ops'],
      items: [
        { id: 'product-health', label: 'Product Health Radar', icon: <Activity className="h-4 w-4" /> },
        { id: 'releases', label: 'Releases & Sentiment Delta', icon: <Server className="h-4 w-4" />, badge: '+14.2% Delta', badgeVariant: 'green' },
        { id: 'incidents', label: 'Production Incidents', icon: <RadioTower className="h-4 w-4" /> },
        { id: 'maintenance', label: 'System Maintenance', icon: <Database className="h-4 w-4" /> },
      ],
    },

    // 10. Persistent Project Memory (Shown for 'all' and 'memory')
    {
      id: 'group-memory',
      label: 'Persistent Project Memory',
      roles: ['all', 'memory'],
      items: [
        { id: 'context', label: 'Context Blocks', icon: <BookOpen className="h-4 w-4" /> },
        {
          id: 'notes',
          label: 'Second Brain & AI Refiner',
          icon: <BrainCircuit className="h-4 w-4" />,
          badge: unrefinedNotes > 0 ? `${unrefinedNotes} Unrefined` : undefined,
          badgeVariant: 'amber',
        },
        { id: 'files', label: 'Project File Vault', icon: <FolderOpen className="h-4 w-4" /> },
        { id: 'decisions', label: 'Decisions Log (ADR)', icon: <Scale className="h-4 w-4" /> },
      ],
    },
  ];

  // Strictly filter groups based on active role selected in top navbar
  const visibleGroups = navGroups.filter((g) =>
    activeRole === 'all' ? true : g.roles.includes(activeRole)
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto p-3">
      <div className="space-y-5">
        {/* Role perspective indicator banner with Hide Nav Action */}
        <div className="rounded-[10px] border border-[#ebebeb] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8f8f8f] font-mono text-[10px] uppercase tracking-wider">
              Perspective
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#171717] bg-[#f5f5f5] px-1.5 py-0.5 rounded-[4px] font-semibold uppercase border border-[#ebebeb]">
                {activeRole.toUpperCase()}
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                title="Hide left navigation bar (keep top navbar only)"
                className="hidden lg:flex p-1 rounded-[4px] text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-1 font-medium text-xs text-[#171717]">
            {activeRole === 'all' && '🌐 All Lifecycle Operations'}
            {activeRole === 'pm' && '📊 Product Strategy & Delivery'}
            {activeRole === 'designer' && '🎨 Design System & UX Validation'}
            {activeRole === 'dev' && '💻 Engineering & Architecture'}
            {activeRole === 'qa' && '🧪 QA Gating & Security Intelligence'}
            {activeRole === 'ops' && '🚀 Production Telemetry & Ops'}
            {activeRole === 'memory' && '🧠 Project Memory & Second Brain'}
          </p>
          <div className="mt-2 text-[10px] text-[#8f8f8f] flex items-center justify-between border-t border-[#f2f2f2] pt-1.5">
            <span>{visibleGroups.reduce((sum, g) => sum + g.items.length, 0)} visible options</span>
            <span className="text-[#0070f3] font-mono">{activeRole === 'all' ? 'Full Access' : 'Filtered'}</span>
          </div>
        </div>

        {/* Navigation Sections */}
        {visibleGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8f8f8f]">
                {group.label}
              </span>
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={`${group.id}-${item.id}`}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`group flex w-full items-center justify-between rounded-[6px] px-2.5 py-1.5 text-xs transition-all ${
                      isActive
                        ? 'bg-white text-[#171717] font-semibold border border-[#ebebeb] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]'
                        : 'text-[#4d4d4d] hover:bg-[#f2f2f2] hover:text-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`${
                          isActive
                            ? 'text-[#171717]'
                            : 'text-[#8f8f8f] group-hover:text-[#171717]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border shrink-0 ${
                          item.badgeVariant === 'terracotta'
                            ? 'bg-[#171717] text-white border-[#171717]'
                            : item.badgeVariant === 'amber'
                            ? 'bg-[#fffbeb] text-[#ab570a] border-[#fde68a]'
                            : item.badgeVariant === 'red'
                            ? 'bg-[#fef2f2] text-[#ee0000] border-[#fecaca]'
                            : item.badgeVariant === 'green'
                            ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                            : 'bg-[#f5f5f5] text-[#8f8f8f] border-[#ebebeb]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 rounded-[8px] border border-[#ebebeb] bg-white p-3 text-[11px] text-[#8f8f8f]">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="font-semibold text-[#171717]">{activeWorkspace.code}</span>
          <span className="text-[#047857] font-medium">{activeWorkspace.healthScore}% HEALTH</span>
        </div>
        <p className="mt-1 text-[#8f8f8f] text-[10px] truncate">
          {activeWorkspace.name} ({activeWorkspace.version})
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Controlled by isSidebarOpen) */}
      {isSidebarOpen && (
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col border-r border-[#ebebeb] bg-[#fafafa] sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-all animate-fade-in">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#fafafa] border-r border-[#ebebeb] shadow-2xl z-10 animate-scale-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#ebebeb] bg-white">
              <span className="font-sans font-semibold text-[#171717] text-sm">Dev Atlas Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-[6px] text-[#8f8f8f] hover:text-[#171717]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
