import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "@/services/reservationService";
import { Reservation, ReservationStatus } from "@/types/reservation";
import { toast } from "sonner";

export const useReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: () => reservationService.getAllReservations(),
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: () => reservationService.getReservationById(id),
    enabled: !!id,
  });
};

export const useUserReservations = (userId: string) => {
  return useQuery({
    queryKey: ["reservations", "user", userId],
    queryFn: () => reservationService.getUserReservations(userId),
    enabled: !!userId,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservation: Omit<Reservation, "id" | "createdAt">) =>
      reservationService.createReservation(reservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Бронювання створено");
    },
    onError: (error: Error) => {
      toast.error(`Помилка створення бронювання: ${error.message}`);
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Reservation> }) =>
      reservationService.updateReservation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Бронювання оновлено");
    },
    onError: (error: Error) => {
      toast.error(`Помилка оновлення бронювання: ${error.message}`);
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationService.deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Бронювання видалено");
    },
    onError: (error: Error) => {
      toast.error(`Помилка видалення бронювання: ${error.message}`);
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      reservationService.updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Статус оновлено");
    },
    onError: (error: Error) => {
      toast.error(`Помилка оновлення статусу: ${error.message}`);
    },
  });
};

