import { Reservation, ReservationStatus } from "@/types/reservation";
import { mockReservations } from "@/data/mockData";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ReservationService {
  private reservations: Reservation[] = [...mockReservations];

  async getAllReservations(): Promise<Reservation[]> {
    await delay(300);
    return [...this.reservations];
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    await delay(200);
    const reservation = this.reservations.find((r) => r.id === id);
    return reservation ? { ...reservation } : null;
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    await delay(300);
    return this.reservations.filter((r) => r.userId === userId);
  }

  async createReservation(reservation: Omit<Reservation, "id" | "createdAt">): Promise<Reservation> {
    await delay(400);
    const newReservation: Reservation = {
      ...reservation,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reservations.unshift(newReservation);
    return { ...newReservation };
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    await delay(400);
    const index = this.reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    this.reservations[index] = { ...this.reservations[index], ...updates };
    return { ...this.reservations[index] };
  }

  async deleteReservation(id: string): Promise<void> {
    await delay(300);
    const index = this.reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    this.reservations.splice(index, 1);
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return this.updateReservation(id, { status });
  }
}

export const reservationService = new ReservationService();

