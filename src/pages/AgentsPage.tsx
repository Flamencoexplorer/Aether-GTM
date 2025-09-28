import { AgentStatusTable } from '@/components/dashboard/AgentStatusTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useGtmAgents } from '@/hooks/useGtmSystem';
export default function AgentsPage() {
  const { data: agents, isLoading, isError } = useGtmAgents();
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold text-gray-900">Agents</h1>
        <p className="mt-2 text-lg text-gray-600">Detailed view of all specialized agents.</p>
      </header>
      <Card className="shadow-md border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">All Agent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Could not load agent data.</AlertDescription>
            </Alert>
          ) : (
            <AgentStatusTable agents={agents || []} showPerfomance={true} showLastActivity={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}