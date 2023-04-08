import { z } from "zod";

export const createRecepieDtoSchema = z.object({
  title: z.string(),
  ingredients: z.string(),
  steps: z.string(),
  type: z.enum(["food", "cocktail"]),
  language: z.enum(["es", "en"]),
});

export type createRecepieDto = z.infer<typeof createRecepieDtoSchema>;
