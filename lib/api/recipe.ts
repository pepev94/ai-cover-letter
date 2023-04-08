import { createRecepieDto } from "@/pages/api/recipe/dto/createRecepie.dto";

export const createRecepie = (dto: createRecepieDto) => {
  return fetch("/api/recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...dto,
    }),
  });
};
