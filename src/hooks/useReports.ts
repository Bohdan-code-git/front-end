import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { MonthlyStats } from "@/types/user";

interface MonthlyStatsSummary {
  month: string;
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  revenue: number;
}

export const useMonthlyStatsList = () => {
  return useQuery({
    queryKey: ["reports", "monthly"],
    queryFn: () => reportService.getMonthlyStatsList(),
  });
};

export const useMonthlyStats = (month: string) => {
  return useQuery({
    queryKey: ["reports", "monthly", month],
    queryFn: () => reportService.getMonthlyStats(month),
    enabled: !!month,
  });
};

