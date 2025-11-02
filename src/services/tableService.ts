import { Table } from "@/types/reservation";
import { mockTables } from "@/data/mockData";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class TableService {
  private tables: Table[] = [...mockTables];

  async getAllTables(): Promise<Table[]> {
    await delay(200);
    return [...this.tables];
  }

  async getTableById(id: string): Promise<Table | null> {
    await delay(150);
    const table = this.tables.find((t) => t.id === id);
    return table ? { ...table } : null;
  }

  async getAvailableTables(): Promise<Table[]> {
    await delay(200);
    return this.tables.filter((t) => t.isAvailable);
  }

  async updateTableAvailability(id: string, isAvailable: boolean): Promise<Table> {
    await delay(300);
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Table with id ${id} not found`);
    }
    this.tables[index] = { ...this.tables[index], isAvailable };
    return { ...this.tables[index] };
  }
}

export const tableService = new TableService();

