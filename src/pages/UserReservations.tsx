import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserReservations } from "@/hooks/useReservations";
import { Reservation } from "@/types/reservation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle2, XCircle, Clock as ClockIcon } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

const UserReservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: userReservations = [], isLoading } = useUserReservations(user?.id || "");

  if (!user) {
    return null;
  }

  const activeReservations = useMemo(
    () => userReservations.filter((r) => r.status === "confirmed" || r.status === "pending"),
    [userReservations]
  );
  const completedReservations = useMemo(
    () => userReservations.filter((r) => r.status === "completed"),
    [userReservations]
  );
  const cancelledReservations = useMemo(
    () => userReservations.filter((r) => r.status === "cancelled"),
    [userReservations]
  );

  const ReservationList = ({ reservations }: { reservations: Reservation[] }) => {
    if (reservations.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Бронювань не знайдено</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{reservation.guestName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Столик №{reservation.tableNumber}
                  </CardDescription>
                </div>
                <StatusBadge status={reservation.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {format(new Date(reservation.createdAt), "d MMM yyyy", { locale: uk })}
                  </span>
                </div>
              </div>
              {reservation.specialRequests && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Особливі побажання: </span>
                    {reservation.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Мої бронювання</h1>
              <p className="text-muted-foreground mt-1">
                Переглядайте історію своїх бронювань
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Активні</CardDescription>
                <CardTitle className="text-3xl">{activeReservations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Підтверджені та очікують</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Завершені</CardDescription>
                <CardTitle className="text-3xl">{completedReservations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Успішно відвідані</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Скасовані</CardDescription>
                <CardTitle className="text-3xl">{cancelledReservations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  <span>Відмінені бронювання</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Активні ({activeReservations.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Завершені ({completedReservations.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Скасовані ({cancelledReservations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <ReservationList reservations={activeReservations} />
            </TabsContent>

            <TabsContent value="completed">
              <ReservationList reservations={completedReservations} />
            </TabsContent>

            <TabsContent value="cancelled">
              <ReservationList reservations={cancelledReservations} />
            </TabsContent>
          </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReservations;
