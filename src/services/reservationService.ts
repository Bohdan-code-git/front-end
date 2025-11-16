import { Reservation, ReservationStatus } from "@/types/reservation";
import { apiClient } from "@/lib/api";

interface GetReservationsParams {
  status?: ReservationStatus;
  date?: string;
  search?: string;
}

class ReservationService {
  async getAllReservations(params?: GetReservationsParams): Promise<Reservation[]> {
    const queryParams: Record<string, string> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.date) queryParams.date = params.date;
    if (params?.search) queryParams.search = params.search;

    return apiClient.get<Reservation[]>("/reservations", queryParams);
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    try {
      return await apiClient.get<Reservation>(`/reservations/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return apiClient.get<Reservation[]>(`/reservations/user/${userId}`);
  }

  async createReservation(
    reservation: Omit<Reservation, "id" | "userId" | "status" | "createdAt">
  ): Promise<Reservation> {
    return apiClient.post<Reservation>("/reservations", reservation);
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    const { id: _, userId, status, createdAt, ...updateData } = updates;
    return apiClient.patch<Reservation>(`/reservations/${id}`, updateData);
  }

  async deleteReservation(id: string): Promise<void> {
    await apiClient.delete(`/reservations/${id}`);
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return apiClient.patch<Reservation>(`/reservations/${id}/status`, { status });
  }
}

export const reservationService = new ReservationService();

