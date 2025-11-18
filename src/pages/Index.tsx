import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Reservation, ReservationStatus } from "@/types/reservation";
import {
    useReservations,
    useCreateReservation,
    useUpdateReservation,
    useUpdateReservationStatus,
} from "@/hooks/useReservations";
import { useTables } from "@/hooks/useTables";
import { ReservationCard } from "@/components/ReservationCard";
import { ReservationDialog } from "@/components/ReservationDialog";
import { TableGrid } from "@/components/TableGrid";
import { ReservationFilters } from "@/components/ReservationFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Calendar, LayoutGrid, User, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: reservations = [], isLoading: isLoadingReservations } = useReservations();
    const { data: tables = [], isLoading: isLoadingTables } = useTables();
    const createReservation = useCreateReservation();
    const updateReservation = useUpdateReservation();
    const updateStatus = useUpdateReservationStatus();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();
    // ---------------------------------------------------------------------

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
    const [dateFilter, setDateFilter] = useState("");

    const filteredReservations = useMemo(() => {
        return reservations.filter((reservation) => {
            const matchesSearch =
                reservation.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reservation.guestPhone.includes(searchQuery) ||
                reservation.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;

            const matchesDate = !dateFilter || reservation.date === dateFilter;

            const matchesUser = !user || user.role === "admin" || reservation.userId === user.id;

            return matchesSearch && matchesStatus && matchesDate && matchesUser;
        });
    }, [reservations, searchQuery, statusFilter, dateFilter, user]);

    const handleSave = (newReservation: Partial<Reservation>) => {
        if (editingReservation) {
            updateReservation.mutate({
                id: editingReservation.id,
                updates: newReservation,
            });
        } else {
            const { userId, status, id, createdAt, ...reservationData } = newReservation;
            createReservation.mutate(reservationData as Omit<Reservation, "id" | "userId" | "status" | "createdAt">);
        }
        setEditingReservation(undefined);
        if (editingReservation) {
            setDialogOpen(false);
        }
    };

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        updateStatus.mutate({ id, status: "cancelled" });
    };

    const handleStatusChange = (id: string, status: ReservationStatus) => {
        updateStatus.mutate({ id, status });
    };

    const handleNewReservation = () => {
        // ✅ ОНОВЛЕНО: Переходимо на вашу сторінку /reservations
        navigate("/reservations");
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Система бронювання столів
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Керуйте бронюваннями вашого ресторану
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {user && user.role === "admin" && (
                                <Button variant="outline" onClick={() => navigate("/admin/reports")}>
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    Звіти
                                </Button>
                            )}
                            <Button onClick={handleNewReservation} size="lg">
                                <Plus className="h-5 w-5 mr-2" />
                                Нове бронювання
                            </Button>
                            {user ? (
                                <Avatar
                                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => navigate("/profile")}
                                >
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <Button variant="outline" onClick={() => navigate("/auth")}>
                                    <User className="h-5 w-5 mr-2" />
                                    Вхід
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="reservations" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="reservations" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Бронювання
                        </TabsTrigger>
                        <TabsTrigger value="tables" className="gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            Столики
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reservations" className="space-y-6">
                        <ReservationFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            dateFilter={dateFilter}
                            onDateFilterChange={setDateFilter}
                        />

                        {isLoadingReservations ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-64 w-full" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredReservations.length > 0 ? (
                                    filteredReservations.map((reservation) => (
                                        <ReservationCard
                                            key={reservation.id}
                                            reservation={reservation}
                                            isAdmin={user?.role === "admin"}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-muted-foreground text-lg">
                                            Бронювань не знайдено
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="tables">
                        {isLoadingTables ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        ) : (
                            <TableGrid tables={tables} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <ReservationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                reservation={editingReservation}
                onSave={handleSave}
            />
        </div>
    );
};

export default Index;