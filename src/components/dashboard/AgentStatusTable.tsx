import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Agent, AgentStatus } from '@/types';
import { cn } from '@/lib/utils';
interface AgentStatusTableProps {
  agents: Agent[];
  showPerfomance?: boolean;
  showLastActivity?: boolean;
}
const statusStyles: Record<AgentStatus, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  idle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
};
export function AgentStatusTable({ agents, showPerfomance = false, showLastActivity = false }: AgentStatusTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          {showPerfomance && <TableHead>Performance</TableHead>}
          {showLastActivity && <TableHead>Last Activity</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id} className="hover:bg-gray-50 transition-colors">
            <TableCell>
              <div className="font-medium text-gray-900">{agent.name}</div>
              <div className="text-sm text-gray-500">{agent.role}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={cn('capitalize', statusStyles[agent.status])}>
                {agent.status}
              </Badge>
            </TableCell>
            {showPerfomance && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={agent.performance} className="w-24 h-2" />
                  <span className="text-sm font-medium text-gray-700">{agent.performance}%</span>
                </div>
              </TableCell>
            )}
            {showLastActivity && (
                <TableCell className="text-gray-600">{agent.lastActivity}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}