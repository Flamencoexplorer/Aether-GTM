import { KpiCard } from '@/components/dashboard/KpiCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { HitlQueue } from '@/components/dashboard/HitlQueue';
import { AgentStatusTable } from '@/components/dashboard/AgentStatusTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, PlayCircle } from 'lucide-react';
import { useGtmStatus, useGtmAgents, useStartGtmMission, useGtmHitlQueue } from '@/hooks/useGtmSystem';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
export default function DashboardPage() {
  const { data: statusData, isLoading: isLoadingStatus, isError: isErrorStatus } = useGtmStatus({ refetchInterval: 5000 });
  const { data: agents, isLoading: isLoadingAgents, isError: isErrorAgents } = useGtmAgents({ refetchInterval: 5000 });
  useGtmHitlQueue({ refetchInterval: 5000 });
  const startMissionMutation = useStartGtmMission();
  const handleStartMission = () => {
    startMissionMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Mission Started", {
          description: "Orchestration agent is now active. Dashboard will update periodically.",
        });
      },
      onError: () => {
        toast.error("Failed to Start Mission", {
          description: "Could not communicate with the orchestration agent.",
        });
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster richColors />
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900">Mission Control</h1>
          <p className="mt-2 text-lg text-gray-600">High-level overview of the GTM operation.</p>
        </div>
        <Button
          onClick={handleStartMission}
          disabled={startMissionMutation.isPending}
          className="mt-4 sm:mt-0 bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
        >
          <PlayCircle className="h-5 w-5 mr-2" />
          {startMissionMutation.isPending ? 'Starting...' : 'Start Mission'}
        </Button>
      </header>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingStatus ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-2/4" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-3/4" /></CardContent>
            </Card>
          ))
        ) : isErrorStatus ? (
          <div className="lg:col-span-3">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Could not load KPIs.</AlertDescription>
            </Alert>
          </div>
        ) : (
          statusData?.kpis.map((kpi) => <KpiCard key={kpi.title} kpi={kpi} />)
        )}
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <FunnelChart />
        <HitlQueue />
      </div>
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Agent Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAgents ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isErrorAgents ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Could not load agent statuses.</AlertDescription>
            </Alert>
          ) : (
            <AgentStatusTable agents={agents?.slice(0, 5) || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}