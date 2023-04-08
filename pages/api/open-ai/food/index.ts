// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream } from "@/utils/OpenAIStream";
import type { NextApiRequest } from "next";

export enum LanguagesEnum {
  es = "es",
  en = "en",
}

export const SpecialRecepieObj = {
  none: "none",
  keto: "keto",
  lowCarb: "low carb",
  glutenFree: "gluten free",
  dairyFree: "dairy free",
  paleo: "paleo",
  sugarFree: "sugar free",
};

export type BodyGetOpenAiResult = {
  foodType: string;
  targetProtein: string;
  targetCarbs: string;
  primaryIngredient: string;
  targetFats: string;
  selectedLanguage: LanguagesEnum;
  personCount: string;
  specialRecipe: string;
  countMacros: boolean;
};

export const config = {
  runtime: "edge",
};

export const SEPARATION_CHARACTERS = "\n#####################";

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type MyCustomRequest = Override<
  NextApiRequest,
  { body: BodyGetOpenAiResult }
>;

const getPromt = (body: BodyGetOpenAiResult) => {
  const {
    foodType,
    targetProtein,
    targetCarbs,
    primaryIngredient,
    targetFats,
    selectedLanguage,
    personCount,
    countMacros,
    specialRecipe,
  } = body;
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return `Damé un receta de cocina. Agrega los gramos o cantidades exactas de cada ingrediente. Dame el titulo, agrega "${SEPARATION_CHARACTERS}" para separar, la lista de ingredientes agrega "${SEPARATION_CHARACTERS}" para separar, el paso a paso para preparar. Se especifico en los detalles de la preparación${
        countMacros &&
        ", agrega la información nutrional al final de lo siguiente"
      } : Una comida casera tipo ${foodType} ,fácil de hacer, que tarde menos de 30 min en hacer. Que tenga menos de ${targetCarbs} carbohidratos por porción,  ${targetProtein} gramos de proteina y ${targetFats} de grasas por porción. Quiero que los ingredientes principales sean ${primaryIngredient}. Debe de ser para ${personCount} personas.`;
    case LanguagesEnum.en:
      return `Give me the title, add "${SEPARATION_CHARACTERS}"  , then the list of ingredients , then add "${SEPARATION_CHARACTERS}" and then give me the  step by step process to prepare it, add the exact quantities of ingredients. Be specific on the details of the process${
        countMacros &&
        ", add the nutritional information at the en of the the following"
      }: A ${foodType} homemade cuisine, easy to do, takes less than 30 minutes to prepare. It must have less ${targetCarbs} calories per serve, with a target protein of ${targetProtein} gms, and ${targetFats} gms of fats per serve. And I want the main ingredient to be ${primaryIngredient}. It must be for ${personCount} persons. ${
        specialRecipe !== SpecialRecepieObj.none &&
        `And make it ${specialRecipe}`
      } `;
  }
};
//

const getSystemCommand = ({ selectedLanguage }: BodyGetOpenAiResult) => {
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return "Eres un chef que es nutriologo, que es un experto haciendo recetas";
    case LanguagesEnum.en:
      return "You are a chef and a nutritionist, which is expert creating recipes";
  }
};

const handler = async (req: Request): Promise<Response> => {
  const body = (await req.json()) as BodyGetOpenAiResult;

  const prompt = getPromt(body);

  console.log(body, prompt);

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: getSystemCommand(body),
      },
      { role: "user", content: prompt },
    ],
    temperature: body.selectedLanguage === LanguagesEnum.es ? 0.85 : 0.3,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(
    payload,
    "https://api.openai.com/v1/chat/completions"
  );
  return new Response(stream);
};

export default handler;
