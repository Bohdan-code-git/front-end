import { Table } from "@/types/reservation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface TableGridProps {
  tables: Table[];
  selectedTable?: string;
  onSelectTable?: (tableNumber: string) => void;
}

export const TableGrid = ({ tables, selectedTable, onSelectTable }: TableGridProps) => {
  const groupedTables = {
    main: tables.filter((t) => t.location === "main"),
    terrace: tables.filter((t) => t.location === "terrace"),
    private: tables.filter((t) => t.location === "private"),
  };

  const locationLabels = {
    main: "Основна зала",
    terrace: "Тераса",
    private: "Приватні зали",
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTables).map(([location, locationTables]) => (
        <div key={location}>
          <h3 className="text-lg font-semibold mb-3">
            {locationLabels[location as keyof typeof locationLabels]}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {locationTables.map((table) => (
              <Card
                key={table.id}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                  table.isAvailable
                    ? "bg-card hover:border-primary"
                    : "bg-muted opacity-60",
                  selectedTable === table.number && "border-primary border-2"
                )}
                onClick={() => table.isAvailable && onSelectTable?.(table.number)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl font-bold text-foreground">
                    {table.number}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{table.capacity}</span>
                  </div>
                  <div
                    className={cn(
                      "text-xs font-medium",
                      table.isAvailable ? "text-success" : "text-destructive"
                    )}
                  >
                    {table.isAvailable ? "Вільний" : "Зайнятий"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
