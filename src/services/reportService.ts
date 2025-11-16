import { MonthlyStats } from "@/types/user";
import { apiClient } from "@/lib/api";

interface MonthlyStatsSummary {
  month: string;
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  revenue: number;
}

class ReportService {
  async getMonthlyStatsList(): Promise<MonthlyStatsSummary[]> {
    return apiClient.get<MonthlyStatsSummary[]>("/reports/monthly");
  }

  async getMonthlyStats(month: string): Promise<MonthlyStats> {
    return apiClient.get<MonthlyStats>(`/reports/monthly/${month}`);
  }
}

export const reportService = new ReportService();

