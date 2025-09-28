import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DealStage } from '@/types';
import { Search, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGtmPipeline } from '@/hooks/useGtmSystem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
const stageStyles: Record<DealStage, string> = {
    Identified: 'bg-gray-100 text-gray-800 border-gray-200',
    Engaged: 'bg-blue-100 text-blue-800 border-blue-200',
    Qualified: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Proposal: 'bg-purple-100 text-purple-800 border-purple-200',
    Won: 'bg-green-100 text-green-800 border-green-200',
    Lost: 'bg-red-100 text-red-800 border-red-200',
};
export default function PipelinePage() {
  const { data: pipelineDeals, isLoading, isError } = useGtmPipeline();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeals = useMemo(() => {
    if (!pipelineDeals) return [];
    return pipelineDeals.filter(deal =>
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pipelineDeals, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold text-gray-900">Sales Pipeline</h1>
        <p className="mt-2 text-lg text-gray-600">In-depth view of prospects and deals from identification to close.</p>
      </header>
      <Card className="shadow-md border-slate-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900">All Deals</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search deals..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Could not load pipeline data.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Est. Close Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((deal) => (
                  <TableRow key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-gray-900">{deal.name}</div>
                      <div className="text-sm text-gray-500">{deal.company}</div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(deal.value)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('capitalize', stageStyles[deal.stage])}>
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{deal.assignedAgent}</TableCell>
                    <TableCell className="text-gray-600">{deal.closeDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}