import { User, MonthlyStats } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "admin@restaurant.com",
    name: "Адміністратор",
    phone: "+380 50 123 4567",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "u2",
    email: "user@example.com",
    name: "Тестовий Користувач",
    phone: "+380 67 987 6543",
    role: "user",
    createdAt: "2025-10-15T00:00:00Z",
  },
];

export const mockMonthlyStats: MonthlyStats[] = [
  {
    month: "2025-10",
    totalReservations: 156,
    completedReservations: 142,
    cancelledReservations: 14,
    revenue: 284500,
    popularTables: [
      { tableNumber: "2", count: 45 },
      { tableNumber: "4", count: 38 },
      { tableNumber: "6", count: 32 },
      { tableNumber: "1", count: 25 },
      { tableNumber: "3", count: 16 },
    ],
    peakHours: [
      { hour: "19:00", count: 42 },
      { hour: "20:00", count: 38 },
      { hour: "18:30", count: 28 },
      { hour: "21:00", count: 24 },
      { hour: "18:00", count: 18 },
    ],
  },
  {
    month: "2025-09",
    totalReservations: 134,
    completedReservations: 125,
    cancelledReservations: 9,
    revenue: 245000,
    popularTables: [
      { tableNumber: "2", count: 38 },
      { tableNumber: "4", count: 35 },
      { tableNumber: "3", count: 28 },
      { tableNumber: "6", count: 22 },
      { tableNumber: "7", count: 11 },
    ],
    peakHours: [
      { hour: "19:00", count: 38 },
      { hour: "20:00", count: 32 },
      { hour: "18:30", count: 26 },
      { hour: "21:00", count: 22 },
      { hour: "19:30", count: 16 },
    ],
  },
];
