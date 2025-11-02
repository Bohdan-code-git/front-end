import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(1, "Пароль обов'язковий"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Ім'я повинно містити мінімум 2 символи"),
  email: z.string().email("Невірний формат email"),
  phone: z
    .string()
    .min(10, "Телефон повинен містити мінімум 10 символів")
    .regex(/^[\d\s\+\-\(\)]+$/, "Невірний формат телефону"),
  password: z.string().min(6, "Пароль повинен містити мінімум 6 символів"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

