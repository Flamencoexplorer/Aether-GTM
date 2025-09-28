import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import { Kpi, Agent, Deal, HitlAction, FunnelDataItem, DealStage } from '../src/types';
// --- Mock Data (Initial State) ---
const kpis: Kpi[] = [
  { title: 'Pipeline Value', value: '$12.4M', change: '+15.2%', changeType: 'increase' },
  { title: 'Target CAC', value: '$15,000', change: '-2.1%', changeType: 'decrease' },
  { title: 'Budget Remaining', value: '$143,500', change: '-5.8%', changeType: 'decrease' },
];
const agents: Agent[] = [
    { id: 'agent-001', name: 'SDO-Alpha', role: 'SDO', status: 'active', performance: 92, lastActivity: 'Sent 50 outreach emails', avatar: '' },
    { id: 'agent-002', name: 'Engage-Bot', role: 'Engagement', status: 'active', performance: 88, lastActivity: 'Qualified 3 leads', avatar: '' },
    { id: 'agent-003', name: 'Deal-Maker', role: 'Deal Desk', status: 'idle', performance: 95, lastActivity: 'Generated proposal for Acme Corp', avatar: '' },
    { id: 'agent-004', name: 'Fin-Bot', role: 'FinOps', status: 'active', performance: 99, lastActivity: 'Processed payment for Globex Inc.', avatar: '' },
    { id: 'agent-005', name: 'Expand-AI', role: 'Expansion', status: 'error', performance: 45, lastActivity: 'Failed to sync health scores', avatar: '' },
    { id: 'agent-006', name: 'SDO-Beta', role: 'SDO', status: 'idle', performance: 78, lastActivity: 'Identified 120 new prospects', avatar: '' },
];
const pipelineDeals: Deal[] = [
    { id: 'deal-001', name: 'Project Titan', company: 'Acme Corp', value: 250000, stage: 'Proposal', assignedAgent: 'Deal-Maker', closeDate: '2024-12-15' },
    { id: 'deal-002', name: 'Project Phoenix', company: 'Globex Inc.', value: 120000, stage: 'Won', assignedAgent: 'Engage-Bot', closeDate: '2024-11-20' },
    { id: 'deal-003', name: 'Project Nebula', company: 'Stark Industries', value: 75000, stage: 'Qualified', assignedAgent: 'Engage-Bot', closeDate: '2025-01-10' },
    { id: 'deal-004', name: 'Project Orion', company: 'Wayne Enterprises', value: 500000, stage: 'Engaged', assignedAgent: 'SDO-Alpha', closeDate: '2025-02-28' },
    { id: 'deal-005', name: 'Project Gemini', company: 'Cyberdyne Systems', value: 95000, stage: 'Lost', assignedAgent: 'SDO-Beta', closeDate: '2024-11-30' },
    { id: 'deal-006', name: 'Project Apollo', company: 'Ollivanders', value: 30000, stage: 'Identified', assignedAgent: 'SDO-Alpha', closeDate: '2025-03-15' },
];
const settings = {
  totalBudget: 200000,
  cacTarget: 15000,
  riskTolerance: 'medium',
  brandVoice: 'Professional, innovative, and slightly formal. Focus on value propositions and ROI.',
};
const hitlQueue: HitlAction[] = [
    { id: 'hitl-001', title: 'Approve 25% Discount', description: 'Deal-Maker requests approval for a 25% discount on Project Titan ($250k value) to close by EOM.', agent: 'Deal-Maker', timestamp: '2h ago' },
    { id: 'hitl-002', title: 'Custom Legal Clause', description: 'Engage-Bot flagged a request for a custom indemnification clause from Wayne Enterprises.', agent: 'Engage-Bot', timestamp: '1d ago' },
];
const funnelData: FunnelDataItem[] = [
    { name: 'Prospects', value: 2000, fill: '#8884d8' },
    { name: 'Identified', value: 1200, fill: '#83a6ed' },
    { name: 'Engaged', value: 800, fill: '#8dd1e1' },
    { name: 'Qualified', value: 500, fill: '#82ca9d' },
    { name: 'Proposal', value: 200, fill: '#a4de6c' },
    { name: 'Won', value: 50, fill: '#d0ed57' },
];
const HIGH_VALUE_DEAL_THRESHOLD = 400000;
export class AppController extends DurableObject<Env> {
  private state: {
    kpis: Kpi[];
    agents: Agent[];
    pipeline: Deal[];
    settings: typeof settings;
    hitlQueue: HitlAction[];
    funnelData: FunnelDataItem[];
  };
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.state = {
      kpis,
      agents,
      pipeline: pipelineDeals,
      settings,
      hitlQueue,
      funnelData,
    };
  }
  async alarm() {
    await this.tick();
  }
  async start() {
    const orchestratorId = this.env.ORCHESTRATION_AGENT.idFromName('main-orchestrator');
    const orchestrator = this.env.ORCHESTRATION_AGENT.get(orchestratorId);
    await orchestrator.startMission();
    const currentAlarm = await this.ctx.storage.getAlarm();
    if (currentAlarm === null) {
      await this.ctx.storage.setAlarm(Date.now() + 5000); // 5 seconds
    }
  }
  async tick() {
    // Simulate a KPI update
    const kpiToUpdate = this.state.kpis[0]; // Pipeline Value
    const currentValue = parseFloat(kpiToUpdate.value.replace(/[$,M]/g, '')) * 1000000;
    const change = (Math.random() - 0.4) * 50000; // Random change
    const newValue = currentValue + change;
    kpiToUpdate.value = `$${(newValue / 1000000).toFixed(2)}M`;
    // Simulate a deal advancing
    const dealToAdvance = this.state.pipeline.find(d => d.stage !== 'Won' && d.stage !== 'Lost');
    if (dealToAdvance) {
      const stages: DealStage[] = ['Identified', 'Engaged', 'Qualified', 'Proposal', 'Won'];
      const currentStageIndex = stages.indexOf(dealToAdvance.stage);
      if (currentStageIndex < stages.length - 1) {
        const newStage = stages[currentStageIndex + 1];
        dealToAdvance.stage = newStage;
        // --- EXCEPTION HANDLING & ESCALATION LOGIC ---
        // If a deal moves to Proposal and is over the threshold, create a HITL action.
        if (newStage === 'Proposal' && dealToAdvance.value > HIGH_VALUE_DEAL_THRESHOLD) {
            const existingAction = this.state.hitlQueue.find(
                action => action.description.includes(dealToAdvance.name)
            );
            if (!existingAction) {
                const newAction: HitlAction = {
                    id: `hitl-${crypto.randomUUID()}`,
                    title: 'High-Value Deal Approval',
                    description: `Deal-Maker requires approval for proposal on "${dealToAdvance.name}" valued at $${dealToAdvance.value.toLocaleString()}.`,
                    agent: 'Deal-Maker',
                    timestamp: 'Just now',
                };
                this.state.hitlQueue.unshift(newAction); // Add to the top of the queue
            }
        }
      }
    }
    // Reschedule the alarm for the next tick
    await this.ctx.storage.setAlarm(Date.now() + 5000);
  }
  async getStatus() {
    return { kpis: this.state.kpis, funnelData: this.state.funnelData };
  }
  async getAgents() {
    return this.state.agents;
  }
  async getPipeline() {
    return this.state.pipeline;
  }
  async getSettings() {
    return this.state.settings;
  }
  async getHitlQueue() {
    return this.state.hitlQueue;
  }
  async updateSettings(newSettings: Partial<typeof settings>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
  }
  async resolveHitlAction(id: string, resolution: 'approved' | 'denied') {
    console.log(`Action ${id} resolved with status: ${resolution}`);
    this.state.hitlQueue = this.state.hitlQueue.filter(action => action.id !== id);
  }
}