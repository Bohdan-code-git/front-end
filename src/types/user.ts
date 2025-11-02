export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  revenue: number;
  popularTables: { tableNumber: string; count: number }[];
  peakHours: { hour: string; count: number }[];
}
