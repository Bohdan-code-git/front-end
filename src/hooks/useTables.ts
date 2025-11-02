import { useQuery } from "@tanstack/react-query";
import { tableService } from "@/services/tableService";

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => tableService.getAllTables(),
  });
};

export const useAvailableTables = () => {
  return useQuery({
    queryKey: ["tables", "available"],
    queryFn: () => tableService.getAvailableTables(),
  });
};

