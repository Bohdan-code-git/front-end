export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  userId: string; // ID пользователя, который создал бронирование
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  isAvailable: boolean;
  location: "main" | "terrace" | "private";
}
