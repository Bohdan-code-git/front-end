import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "@/services/reservationService";
import { Reservation } from "@/types/reservation";
import { ReservationFormData } from "@/schemas/reservationSchema";

export const useCreateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReservationFormData) => {
            const newReservation: Partial<Reservation> = {
                ...data,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            return reservationService.create(newReservation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            queryClient.invalidateQueries({ queryKey: ["tables", "available"] });
        },
        onError: (error) => {
            console.error("Reservation creation error:", error);
        },
    });
};