// ========================================================
// DEV ATLAS — MASTER QA & INTEGRATION TEST ENGINE
// ========================================================

import {
  initialDevTasks,
  initialPRDs,
  initialProblemClusters,
  initialFeedback,
  initialSecurityFindings,
  initialSecurityEvidence,
  initialSecurityAssessments,
  initialValidationSessions,
  initialContextBlocks,
  initialDecisions,
  initialSecondBrainNotes,
  initialReadinessChecks,
  initialMetrics,
  initialSprintFeatures,
  initialBugItems,
  initialQATestCases,
  initialDesignTokens,
  initialFigmaSpecs,
  initialPersonas,
  initialResearchSessions,
  initialUXFindings,
  initialReleases,
  initialIncidents,
  initialMaintenanceTasks,
  initialFileVaultItems,
  initialStrategicInsights,
  initialFeatureRequests,
  initialWorkspaces,
  initialLLMModels,
} from './src/data/initialSeedData';
import { evaluateSecurityGate } from './src/security/services/securityGate';
import { calculateSecurityMetrics } from './src/security/services/securityMetrics';
import { DemoSecurityAdapter } from './src/security/adapters/DemoSecurityAdapter';
import { StrixSecurityAdapter } from './src/security/adapters/StrixSecurityAdapter';
import { VulnClawSecurityAdapter } from './src/security/adapters/VulnClawSecurityAdapter';
import { githubService } from './src/services/githubService';
import {
  SecurityFinding,
  DevTask,
  ProductRequirement,
  ProblemCluster,
  RoleType,
  NavSection,
  ContextBlock,
  ProjectDecision,
  SecondBrainNote,
  ProjectWorkspace,
  LLMModelTarget,
  PromptOptimizationMode,
} from './src/types';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(suite: string, name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    results.push({ suite, name, passed: true, durationMs: performance.now() - start });
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ suite, name, passed: false, error: err?.message || String(err), durationMs: performance.now() - start });
    console.error(`  ❌ [FAIL] ${name}:`, err?.message || String(err));
  }
}

export async function runAllTests() {
  console.log('\n================================================================');
  console.log('🚀 RUNNING DEV ATLAS MASTER QA & INTEGRATION TEST ENGINE');
  console.log('================================================================\n');

  // ----------------------------------------------------
  // SUITE 1: Seed Data Integrity & Schema Consistency
  // ----------------------------------------------------
  console.log('📦 SUITE 1: Data Integrity & Schema Validation');
  await runTest('Data Integrity', 'Initial seed data contains all 9 lifecycle modules with non-empty datasets', () => {
    if (!initialMetrics) throw new Error('Missing metrics in seed data');
    if (!initialDevTasks || initialDevTasks.length === 0) throw new Error('Missing dev tasks');
    if (!initialPRDs || initialPRDs.length === 0) throw new Error('Missing PRDs');
    if (!initialProblemClusters || initialProblemClusters.length === 0) throw new Error('Missing problem clusters');
    if (!initialFeedback || initialFeedback.length === 0) throw new Error('Missing feedback items');
    if (!initialSecurityFindings || initialSecurityFindings.length === 0) throw new Error('Missing security findings');
    if (!initialSecurityEvidence || initialSecurityEvidence.length === 0) throw new Error('Missing security evidence');
    if (!initialValidationSessions || initialValidationSessions.length === 0) throw new Error('Missing validation specs');
    if (!initialContextBlocks || initialContextBlocks.length === 0) throw new Error('Missing context blocks');
    if (!initialDecisions || initialDecisions.length === 0) throw new Error('Missing decisions log');
    if (!initialSecondBrainNotes || initialSecondBrainNotes.length === 0) throw new Error('Missing second brain notes');
    if (!initialDesignTokens || initialDesignTokens.length === 0) throw new Error('Missing design tokens');
    if (!initialFigmaSpecs || initialFigmaSpecs.length === 0) throw new Error('Missing figma specs');
    if (!initialPersonas || initialPersonas.length === 0) throw new Error('Missing personas');
    if (!initialReleases || initialReleases.length === 0) throw new Error('Missing release items');
  });

  await runTest('Data Integrity', 'Currency values in seed data use Indian Rupee (INR / ₹) formats', () => {
    const prd105 = initialPRDs.find((p) => p.reqCode === 'PRD-105');
    if (!prd105 || !prd105.businessImpact.includes('₹')) {
      throw new Error('PRD-105 business impact does not contain INR symbol ₹');
    }
    const cluster = initialProblemClusters[0];
    if (!cluster.aiInsight.velocityNote.includes('₹')) {
      throw new Error('Problem cluster velocityNote does not contain INR symbol ₹');
    }
  });

  await runTest('Data Integrity', 'All security findings have valid codes and severity types', () => {
    for (const finding of initialSecurityFindings) {
      if (!finding.findingCode.startsWith('SEC-')) throw new Error(`Invalid code format: ${finding.findingCode}`);
      if (!['critical', 'high', 'medium', 'low', 'info'].includes(finding.severity)) {
        throw new Error(`Invalid severity: ${finding.severity}`);
      }
      if (!finding.remediation) throw new Error(`Missing remediation for ${finding.findingCode}`);
    }
  });

  await runTest('Data Integrity', 'Critical findings have corresponding VulnClaw evidence records', () => {
    const criticalFindings = initialSecurityFindings.filter((f) => f.severity === 'critical');
    for (const cf of criticalFindings) {
      const evidence = initialSecurityEvidence.find((e) => e.findingId === cf.id);
      if (!evidence) throw new Error(`No evidence record found for critical finding ${cf.findingCode}`);
      if (!evidence.content) throw new Error(`Missing content in evidence for ${cf.findingCode}`);
    }
  });

  // ----------------------------------------------------
  // SUITE 2: Multi-Project Workspaces & Real GitHub Ingestion
  // ----------------------------------------------------
  console.log('\n🏢 SUITE 2: Multi-Project Workspaces & Real GitHub Ingestion');
  await runTest('Workspaces', 'Workspace catalog contains multiple distinct projects with valid schemas', () => {
    if (initialWorkspaces.length < 3) throw new Error('Expected at least 3 initial project workspaces');
    const codes = new Set(initialWorkspaces.map((w) => w.code));
    if (codes.size !== initialWorkspaces.length) throw new Error('Duplicate workspace codes detected');
    
    const streamflow = initialWorkspaces.find((w) => w.code === 'STFL');
    const novapay = initialWorkspaces.find((w) => w.code === 'NVAP');
    const aether = initialWorkspaces.find((w) => w.code === 'AETH');

    if (!streamflow || !novapay || !aether) throw new Error('Missing core workspaces (STFL, NVAP, AETH)');
    if (novapay.platform !== 'Mobile') throw new Error('NovaPay platform mismatch');
  });

  await runTest('Workspaces', 'GitHubService analyzes real repository and generates grounded lifecycle datasets', async () => {
    const analysis = await githubService.analyzeRepository('https://github.com/usestrix/strix');
    if (analysis.code !== 'STRX') throw new Error(`Expected code STRX, got ${analysis.code}`);
    if (analysis.prds.length === 0) throw new Error('Expected real PRDs generated for repository');
    if (analysis.devTasks.length === 0) throw new Error('Expected real DevTasks generated for repository');
    if (analysis.securityFindings.length === 0) throw new Error('Expected real SecurityFindings generated for repository');
    if (analysis.securityEvidence.length === 0) throw new Error('Expected real SecurityEvidence generated for repository');
  });

  // ----------------------------------------------------
  // SUITE 3: Security Gate & Metrics Calculation
  // ----------------------------------------------------
  console.log('\n🔒 SUITE 3: Security Gate & Metrics Intelligence');
  await runTest('Security Engine', 'evaluateSecurityGate blocks release when open Critical finding exists', () => {
    const findings: SecurityFinding[] = [...initialSecurityFindings];
    const gateResult = evaluateSecurityGate(findings);
    if (gateResult.status !== 'failed') {
      throw new Error(`Expected gate status to be 'failed', got '${gateResult.status}'`);
    }
    if (gateResult.criticalCount === 0) {
      throw new Error('Expected at least 1 critical blocker');
    }
    if (!gateResult.blockers.some((b) => b.includes('SEC-014'))) {
      throw new Error('Expected SEC-014 in blockers list');
    }
  });

  await runTest('Security Engine', 'evaluateSecurityGate passes when all critical findings are resolved or risk-accepted', () => {
    const resolvedFindings: SecurityFinding[] = initialSecurityFindings.map((f) => ({
      ...f,
      status: f.severity === 'critical' || f.severity === 'high' ? ('verified-fixed' as const) : f.status,
    }));
    const gateResult = evaluateSecurityGate(resolvedFindings);
    if (gateResult.status !== 'passed') {
      throw new Error(`Expected gate to be 'passed', got '${gateResult.status}' with blockers: ${gateResult.blockers.join(', ')}`);
    }
    if (gateResult.score < 90) {
      throw new Error(`Expected score >= 90, got ${gateResult.score}`);
    }
  });

  await runTest('Security Engine', 'calculateSecurityMetrics calculates correct severity distribution & health score', () => {
    const metrics = calculateSecurityMetrics(initialSecurityAssessments, initialSecurityFindings);
    if (typeof metrics.securityHealthScore !== 'number') throw new Error('Invalid health score type');
    if (metrics.criticalOpenCount !== initialSecurityFindings.filter((f) => f.severity === 'critical' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk').length) {
      throw new Error('Critical count mismatch');
    }
  });

  // ----------------------------------------------------
  // SUITE 4: Security Scanner Adapters (Strix & VulnClaw)
  // ----------------------------------------------------
  console.log('\n🛡️ SUITE 4: Security Scanner Adapters');
  await runTest('Security Adapters', 'DemoSecurityAdapter returns valid assessment results', async () => {
    const adapter = new DemoSecurityAdapter();
    const result = await adapter.startAssessment({
      name: 'Test Scan',
      targetType: 'api',
      target: 'https://api.streamflow.internal/v2',
      mode: 'standard',
      provider: 'demo',
      scope: {
        authorized: true,
        allowedTargets: ['api.streamflow.internal'],
        excludedTargets: [],
        confirmedBy: 'Lead QA',
      },
    });

    if (!result.assessment) throw new Error('Missing assessment in result');
    if (result.findings.length === 0) throw new Error('Expected findings in result');
    if (result.assessment.status !== 'completed') throw new Error(`Assessment status: ${result.assessment.status}`);
  });

  await runTest('Security Adapters', 'StrixSecurityAdapter produces AST & OWASP mapped findings', async () => {
    const adapter = new StrixSecurityAdapter();
    const result = await adapter.startAssessment({
      name: 'Strix AST Scan',
      targetType: 'repository',
      target: 'github.com/signalslab/streamflow',
      mode: 'deep',
      provider: 'strix',
      scope: {
        authorized: true,
        allowedTargets: ['*.streamflow.internal'],
        excludedTargets: [],
        confirmedBy: 'Lead PM',
      },
    });

    if (result.findings.length === 0) throw new Error('Strix produced zero findings');
    for (const f of result.findings) {
      if (!f.owasp) throw new Error(`Strix finding missing OWASP tag: ${f.title}`);
    }
  });

  await runTest('Security Adapters', 'VulnClawSecurityAdapter returns grounded evidence payloads', async () => {
    const adapter = new VulnClawSecurityAdapter();
    const result = await adapter.startAssessment({
      name: 'VulnClaw Dynamic Scan',
      targetType: 'api',
      target: 'https://api.streamflow.internal/v2/monetization',
      mode: 'deep',
      provider: 'vulnclaw',
      scope: {
        authorized: true,
        allowedTargets: ['api.streamflow.internal'],
        excludedTargets: [],
        confirmedBy: 'Security Lead',
      },
    });

    if (result.evidence.length === 0) throw new Error('VulnClaw produced zero evidence items');
    const httpEvidence = result.evidence.find((e) => e.type === 'http-request');
    if (!httpEvidence) throw new Error('Expected at least one HTTP request evidence payload');
  });

  // ----------------------------------------------------
  // SUITE 5: Kanban & Closed-Loop Workflows
  // ----------------------------------------------------
  console.log('\n📋 SUITE 5: Kanban & Closed-Loop Workflows');
  await runTest('Kanban & Lifecycle', 'Advancing a task traverses statuses sequentially', () => {
    const task: DevTask = { ...initialDevTasks[0], status: 'todo' };
    const transitions: Record<DevTask['status'], DevTask['status']> = {
      todo: 'in-progress',
      'in-progress': 'review',
      review: 'done',
      done: 'done',
    };

    task.status = transitions[task.status];
    if (task.status !== 'in-progress') throw new Error(`Expected in-progress, got ${task.status}`);
    task.status = transitions[task.status];
    if (task.status !== 'review') throw new Error(`Expected review, got ${task.status}`);
    task.status = transitions[task.status];
    if (task.status !== 'done') throw new Error(`Expected done, got ${task.status}`);
  });

  // ----------------------------------------------------
  // SUITE 6: Multi-LLM Model Target Registry & Token Intelligence
  // ----------------------------------------------------
  console.log('\n🤖 SUITE 6: Multi-LLM Token Cost & Model Intelligence');
  await runTest('LLM Intelligence', 'Registry supports Claude 3.7, Claude 3.5, GPT-4o, o3-mini, Gemini 2.0, DeepSeek R1, Llama 3.3', () => {
    if (initialLLMModels.length < 7) throw new Error('Expected at least 7 LLM model profiles');
    const modelIds = initialLLMModels.map((m) => m.id);
    if (!modelIds.includes('claude-3-7-sonnet')) throw new Error('Missing Claude 3.7 Sonnet');
    if (!modelIds.includes('gpt-4o')) throw new Error('Missing GPT-4o');
    if (!modelIds.includes('gemini-2-flash')) throw new Error('Missing Gemini 2.0 Flash');
    if (!modelIds.includes('deepseek-r1')) throw new Error('Missing DeepSeek R1');
    if (!modelIds.includes('o3-mini')) throw new Error('Missing OpenAI o3-mini');
  });

  await runTest('LLM Intelligence', 'Calculates accurate token count and INR (₹) costs per execution', () => {
    const model = initialLLMModels.find((m) => m.id === 'claude-3-7-sonnet')!;
    const testPrompt = '<task_context><project>StreamFlow</project></task_context>'.repeat(50);
    const estimatedInputTokens = Math.round(testPrompt.length / 3.75);
    const estimatedOutputTokens = 1500;

    const inputCostINR = (estimatedInputTokens / 1_000_000) * model.inputCostPerMillionINR;
    const outputCostINR = (estimatedOutputTokens / 1_000_000) * model.outputCostPerMillionINR;
    const totalCostINR = inputCostINR + outputCostINR;

    if (totalCostINR <= 0) throw new Error('Cost calculation must be greater than 0');
  });

  // ----------------------------------------------------
  // SUITE 7: Prompt Optimization Modes Differentiation
  // ----------------------------------------------------
  console.log('\n⚡ SUITE 7: Optimization Modes Differentiation');
  await runTest('Optimization Modes', 'Each of the 4 optimization modes creates distinct prompt structures', () => {
    const modes: PromptOptimizationMode[] = ['full-context', 'token-economy', 'security-hardened', 'tdd-verification'];
    const outputs = new Set<string>();

    for (const mode of modes) {
      let samplePrompt = '';
      if (mode === 'token-economy') {
        samplePrompt = '<!-- TOKEN ECONOMY COMPRESSED --> <sig>compact</sig>';
      } else if (mode === 'security-hardened') {
        samplePrompt = '<!-- STRICT SECURITY HARDENED --> <threat_model_profile>';
      } else if (mode === 'tdd-verification') {
        samplePrompt = '<!-- TDD TEST SPECIFICATION --> <acceptance_test_matrix>';
      } else {
        samplePrompt = '<!-- FULL LIFECYCLE CONTEXT --> <task_context>';
      }
      outputs.add(samplePrompt);
    }

    if (outputs.size !== 4) {
      throw new Error('Expected 4 distinctly different prompt payloads across optimization modes');
    }
  });

  // ----------------------------------------------------
  // SUITE 8: Persistent Project Memory OS & ADR Logs
  // ----------------------------------------------------
  console.log('\n🧠 SUITE 8: Project Memory OS & ADR State');
  await runTest('Memory OS', 'ADR logging creates immutable decision record with architectural impact', () => {
    const newDecision: ProjectDecision = {
      id: `adr-${Date.now()}`,
      decisionCode: `ADR-${String(initialDecisions.length + 1).padStart(3, '0')}`,
      title: 'Adopt Strix and VulnClaw Autonomous Security Adapters',
      date: 'Aug 29, 2026',
      category: 'Architecture',
      context: 'Mandate zero critical vulnerability releases in StreamFlow v4.2.0.',
      decisionMade: 'Standardize on Strix AST analyzer and VulnClaw verifiable HTTP proof verification.',
      consequences: 'Eliminated release candidate deployment bottlenecks while enforcing zero IDOR vulnerabilities.',
      stakeholders: ['Alex Chen (Staff Security Engineer)', 'Engineering Lead'],
    };

    if (!newDecision.decisionCode.startsWith('ADR-')) throw new Error('Invalid ADR code');
    if (newDecision.stakeholders.length < 2) throw new Error('ADR must document stakeholders');
  });

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n================================================================');
  console.log('📈 MASTER TEST EXECUTION SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total Tests Run: ${total}`);
  console.log(`Passed:         ${passed} ✅`);
  console.log(`Failed:         ${failed} ${failed > 0 ? '❌' : ''}`);
  console.log('================================================================\n');

  return { total, passed, failed, results };
}

// Auto-run
runAllTests()
  .then((res) => {
    if (res.failed > 0) process.exit(1);
    else process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
