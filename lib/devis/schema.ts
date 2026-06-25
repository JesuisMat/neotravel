import { z } from "zod";

export const calculerDevisSchema = z.object({
  nb_passagers: z.number().int().positive(),
  date_depart: z.union([z.string(), z.date()]),
  date_demande: z.union([z.string(), z.date()]).optional(),
  date_retour: z.union([z.string(), z.date()]).optional(),
  distance_km: z.number().positive(),
  type_vehicule: z.enum([
    "minibus_19",
    "autocar_53",
    "autocar_63",
    "autocar_67",
    "autocar_85",
  ]),
  options: z
    .array(z.enum(["guide", "nuit_chauffeur", "peages"]))
    .optional(),
});

export type CalculerDevisInput = z.infer<typeof calculerDevisSchema>;
