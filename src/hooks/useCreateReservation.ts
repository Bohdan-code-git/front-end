import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Reservation, ReservationFormData } from "@/types/reservation";

// --- TEMPORARY MOCK IMPLEMENTATION ---
const mockedCreateReservation = async (
    data: ReservationFormData
): Promise<Reservation> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        ...data,
        id: `r${Date.now()}`,
        userId: 'mock-user-id',
        guestEmail: data.guestEmail || '', // Handle optional email field
        status: 'pending',
        createdAt: new Date().toISOString(),
    } as Reservation;
};


export const useCreateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReservationFormData) => {

            const reservationData: Omit<Reservation, "id" | "userId" | "status" | "createdAt"> = {
                ...data,
                guestEmail: data.guestEmail || '', // Ensure optional field is handled
            };

            return mockedCreateReservation(reservationData);

            // WHEN BACKEND IS READY
            // return reservationService.createReservation(reservationData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (error) => {
            console.error("Reservation creation error:", error);
            throw error;
        },
    });
};