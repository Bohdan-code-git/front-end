import { ReservationStatus } from "@/types/reservation";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: ReservationStatus;
}

const statusConfig = {
  pending: {
    label: "Очікує",
    variant: "secondary" as const,
  },
  confirmed: {
    label: "Підтверджено",
    variant: "default" as const,
  },
  cancelled: {
    label: "Скасовано",
    variant: "destructive" as const,
  },
  completed: {
    label: "Завершено",
    variant: "outline" as const,
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};
