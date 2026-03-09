import api from '@/lib/api';
import type { DashboardResponse } from '@/types';

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>('/dashboard');
    return response.data;
  },

  async getEstatisticasTipoCrime(): Promise<Record<string, unknown>> {
    const response = await api.get<Record<string, unknown>>('/dashboard/tipos-crime');
    return response.data;
  },
};
