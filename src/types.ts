export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}
export type AgentStatus = 'active' | 'idle' | 'error';
export interface Agent {
  id: string;
  name: string;
  role: 'SDO' | 'Engagement' | 'Deal Desk' | 'FinOps' | 'Expansion';
  status: AgentStatus;
  performance: number; // A value from 0 to 100
  lastActivity: string;
  avatar: string;
}
export type DealStage = 'Identified' | 'Engaged' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: DealStage;
  assignedAgent: string;
  closeDate: string;
}
export interface HitlAction {
  id: string;
  title: string;
  description: string;
  agent: string;
  timestamp: string;
}
export interface FunnelDataItem {
  name: DealStage | 'Prospects';
  value: number;
  fill: string;
}
export interface GtmStatus {
    kpis: Kpi[];
    funnelData: FunnelDataItem[];
}