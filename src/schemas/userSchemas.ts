import { z } from "zod";

export const updateMePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Confirmation du mot de passe requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
