import { useQuery } from "@tanstack/react-query";
import { tableService } from "@/services/tableService";

import { mockTables } from "@/data/mockData";

// T E M P O R A R Y   M O C K S
const mockedTableService = {
    getAllTables: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return mockTables;
    },
    getAvailableTables: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return mockTables.filter(t => t.isAvailable);
    }
};
// E N D   O F   T E M P O R A R Y   M O C K S

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
   /* queryFn: () => tableService.getAllTables(),*/
      queryFn: () => mockedTableService.getAllTables(),
  });
};

export const useAvailableTables = () => {
  return useQuery({
    queryKey: ["tables", "available"],
   /* queryFn: () => tableService.getAvailableTables(),*/
      queryFn: () => mockedTableService.getAvailableTables(),
  });
};

