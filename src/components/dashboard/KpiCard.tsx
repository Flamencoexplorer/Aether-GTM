import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Kpi } from '@/types';
import { cn } from '@/lib/utils';
interface KpiCardProps {
  kpi: Kpi;
}
export function KpiCard({ kpi }: KpiCardProps) {
  const isIncrease = kpi.changeType === 'increase';
  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-gray-900">{kpi.value}</div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span
            className={cn(
              'flex items-center gap-1',
              isIncrease ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isIncrease ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {kpi.change}
          </span>
          <span className="ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}