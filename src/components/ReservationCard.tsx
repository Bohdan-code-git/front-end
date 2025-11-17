import { Reservation } from "@/types/reservation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

interface ReservationCardProps {
  reservation: Reservation;
  isAdmin?: boolean;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Reservation["status"]) => void;
}

export const ReservationCard = ({
  reservation,
  isAdmin = false,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {reservation.guestName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Столик №{reservation.tableNumber}</span>
            </div>
          </div>
          <StatusBadge status={reservation.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(reservation.date), "d MMMM yyyy", { locale: uk })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.guests} гостей</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{reservation.guestPhone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{reservation.guestEmail}</span>
        </div>

        {reservation.specialRequests && (
          <div className="flex items-start gap-2 text-sm bg-muted p-3 rounded-lg">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{reservation.specialRequests}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {isAdmin && reservation.status === "pending" && onStatusChange && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(reservation.id, "confirmed")}
              className="flex-1"
            >
              Підтвердити
            </Button>
          )}
          
          {isAdmin && onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(reservation)}
              className="flex-1"
            >
              Редагувати
            </Button>
          )}
          
          {isAdmin && onDelete && reservation.status !== "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(reservation.id)}
            >
              Скасувати
            </Button>
          )}

            {isAdmin && reservation.status === "confirmed" && onStatusChange && (
                <Button
                    size="sm"
                    variant="default"
                    onClick={() => onStatusChange(reservation.id, "completed")}
                    className="flex-1"
                >
                    Завершити
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
