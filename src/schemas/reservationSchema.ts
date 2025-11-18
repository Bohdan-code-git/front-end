import { z } from "zod";

export const reservationSchema = z.object({
  guestName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  guestPhone: z
    .string()
    .min(10, "Телефон повинен містити мінімум 10 символів")
    .regex(/^[\d\s\+\-\(\)]+$/, "Невірний формат телефону"),
  guestEmail: z.string().email("Невірний формат email").optional().or(z.literal('')),
  date: z.string().min(1, "Оберіть дату"),
  time: z.string().min(1, "Оберіть час"),
  guests: z
    .number()
    .min(1, "Мінімум 1 гість")
    .max(20, "Максимум 20 гостей"),
  tableNumber: z.string().min(1, "Оберіть столик"),
  specialRequests: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

