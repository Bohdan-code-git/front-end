import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationStatus } from "@/types/reservation";
import { Search } from "lucide-react";

interface ReservationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReservationStatus | "all";
  onStatusFilterChange: (status: ReservationStatus | "all") => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
}

export const ReservationFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
}: ReservationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">Пошук</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Ім'я, телефон, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Статус</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі статуси</SelectItem>
            <SelectItem value="pending">Очікує</SelectItem>
            <SelectItem value="confirmed">Підтверджено</SelectItem>
            <SelectItem value="cancelled">Скасовано</SelectItem>
            <SelectItem value="completed">Завершено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Дата</Label>
        <Input
          id="date"
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
};
