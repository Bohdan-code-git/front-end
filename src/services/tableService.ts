import { Table } from "@/types/reservation";
import { apiClient } from "@/lib/api";

interface GetAvailableTablesParams {
  date?: string;
  time?: string;
  guests?: number;
}

class TableService {
  async getAllTables(): Promise<Table[]> {
    return apiClient.get<Table[]>("/tables");
  }

  async getTableById(id: string): Promise<Table | null> {
    try {
      return await apiClient.get<Table>(`/tables/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async getAvailableTables(params?: GetAvailableTablesParams): Promise<Table[]> {
    const queryParams: Record<string, string> = {};
    if (params?.date) queryParams.date = params.date;
    if (params?.time) queryParams.time = params.time;
    if (params?.guests) queryParams.guests = params.guests.toString();

    return apiClient.get<Table[]>("/tables/available", queryParams);
  }

  async updateTableAvailability(id: string, isAvailable: boolean): Promise<Table> {
    return apiClient.patch<Table>(`/tables/${id}/availability`, { isAvailable });
  }
}

export const tableService = new TableService();

