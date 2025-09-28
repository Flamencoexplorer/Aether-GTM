import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGtmStatus } from '@/hooks/useGtmSystem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
export function FunnelChart() {
  const { data, isLoading, isError } = useGtmStatus();
  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-80 w-full" />;
    }
    if (isError) {
      return (
        <div className="flex items-center justify-center h-80">
          <Alert variant="destructive" className="w-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Could not load funnel data.</AlertDescription>
          </Alert>
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart>
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
            }}
          />
          <Funnel dataKey="value" data={data?.funnelData} isAnimationActive>
            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey="name"
              className="font-semibold"
            />
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    );
  };
  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-slate-200 col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">GTM Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">{renderContent()}</div>
      </CardContent>
    </Card>
  );
}