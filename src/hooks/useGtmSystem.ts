import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Kpi, Agent, Deal, GtmStatus, HitlAction } from '@/types';
// --- API Fetcher Functions ---
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`/api/v1/gtm_system${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Network response was not ok for endpoint: ${endpoint}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  return result.data;
};
// --- Custom Hooks ---
export const useGtmStatus = () => {
  return useQuery<GtmStatus>({
    queryKey: ['gtm-status'],
    queryFn: () => apiFetch<GtmStatus>('/status'),
  });
};
export const useGtmAgents = () => {
  return useQuery<Agent[]>({
    queryKey: ['gtm-agents'],
    queryFn: () => apiFetch<Agent[]>('/agents'),
  });
};
export const useGtmPipeline = () => {
  return useQuery<Deal[]>({
    queryKey: ['gtm-pipeline'],
    queryFn: () => apiFetch<Deal[]>('/pipeline'),
  });
};
export const useGtmSettings = () => {
  return useQuery<Record<string, any>>({
    queryKey: ['gtm-settings'],
    queryFn: () => apiFetch<Record<string, any>>('/settings'),
  });
};
export const useGtmHitlQueue = () => {
    const queryResult = useQuery<HitlAction[]>({
        queryKey: ['gtm-hitl-queue'],
        queryFn: () => apiFetch<HitlAction[]>('/hitl_queue'),
    });
    return { ...queryResult, refetch: queryResult.refetch };
};
// --- Mutations ---
export const useStartGtmMission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => apiFetch('/start', { method: 'POST' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gtm-status'] });
            queryClient.invalidateQueries({ queryKey: ['gtm-pipeline'] });
        },
    });
};
export const useUpdateGtmSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: Record<string, any>) => apiFetch('/settings', {
            method: 'POST',
            body: JSON.stringify(settings),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gtm-settings'] });
        },
    });
};
export const useResolveHitlAction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, resolution }: { id: string, resolution: 'approved' | 'denied' }) => apiFetch(`/hitl_queue/${id}`, {
            method: 'POST',
            body: JSON.stringify({ resolution }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gtm-hitl-queue'] });
        },
    });
};