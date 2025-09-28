import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGtmSettings, useUpdateGtmSettings } from '@/hooks/useGtmSystem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
export default function SettingsPage() {
  const { data: settings, isLoading, isError } = useGtmSettings();
  const updateSettingsMutation = useUpdateGtmSettings();
  const [formData, setFormData] = useState({
    totalBudget: '',
    cacTarget: '',
    riskTolerance: '',
    brandVoice: '',
  });
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  useEffect(() => {
    if (settings && !isFormInitialized) {
      setFormData({
        totalBudget: settings.totalBudget || '',
        cacTarget: settings.cacTarget || '',
        riskTolerance: settings.riskTolerance || '',
        brandVoice: settings.brandVoice || '',
      });
      setIsFormInitialized(true);
    }
  }, [settings, isFormInitialized]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData, {
        onSuccess: () => {
            toast.success("Settings Saved", {
                description: "Global constraints have been updated successfully.",
            });
        },
        onError: () => {
            toast.error("Error", {
                description: "Failed to save settings.",
            });
        }
    });
  };
  const renderForm = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
          </div>
          <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-24 w-full" /></div>
        </div>
      );
    }
    if (isError) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load settings data.</AlertDescription>
        </Alert>
      );
    }
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="total-budget">Total Budget</Label>
            <Input id="total-budget" type="number" placeholder="e.g., 200000" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cac-target">Target CAC</Label>
            <Input id="cac-target" type="number" placeholder="e.g., 15000" value={formData.cacTarget} onChange={(e) => setFormData({...formData, cacTarget: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
          <Select value={formData.riskTolerance} onValueChange={(value) => setFormData({...formData, riskTolerance: value})}>
            <SelectTrigger id="risk-tolerance">
              <SelectValue placeholder="Select risk tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand-voice">Brand Voice</Label>
          <Textarea
            id="brand-voice"
            placeholder="Describe the brand voice..."
            value={formData.brandVoice}
            onChange={(e) => setFormData({...formData, brandVoice: e.target.value})}
            className="min-h-24"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster richColors />
      <header>
        <h1 className="text-4xl font-display font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-lg text-gray-600">Adjust the global constraints of the GTM mission.</p>
      </header>
      <Card className="shadow-md border-slate-200 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Global Constraints</CardTitle>
            <CardDescription>These parameters control the behavior of all agents in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderForm()}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={updateSettingsMutation.isPending} className="bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                  {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}