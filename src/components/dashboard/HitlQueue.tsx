import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Check, X, Bot, Terminal } from 'lucide-react';
import { useGtmHitlQueue, useResolveHitlAction } from '@/hooks/useGtmSystem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function HitlQueue() {
  const { data: hitlQueue, isLoading, isError } = useGtmHitlQueue();
  const resolveActionMutation = useResolveHitlAction();
  const handleResolve = (id: string, resolution: 'approved' | 'denied') => {
    resolveActionMutation.mutate({ id, resolution });
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load HITL queue.</AlertDescription>
        </Alert>
      );
    }
    if (!hitlQueue || hitlQueue.length === 0) {
        return <p className="text-sm text-center text-gray-500 py-10">No pending actions.</p>;
    }
    return (
      <div className="space-y-4">
        {hitlQueue.map((action, index) => (
          <div key={action.id}>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-gray-800">{action.title}</div>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  <span>{action.agent}</span>
                </div>
                <span>{action.timestamp}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                  onClick={() => handleResolve(action.id, 'approved')}
                  disabled={resolveActionMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-colors"
                  onClick={() => handleResolve(action.id, 'denied')}
                  disabled={resolveActionMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Deny
                </Button>
              </div>
            </div>
            {index < hitlQueue.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    );
  };
  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-slate-200 col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">HITL Action Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">{renderContent()}</ScrollArea>
      </CardContent>
    </Card>
  );
}