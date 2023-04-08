// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LanguagesEnum } from "@/utils/createRecepie";
import { OpenAIStream } from "@/utils/OpenAIStream";
import type { NextApiRequest } from "next";
import { SEPARATION_CHARACTERS } from "../food";

export type BodyGetOpenAiCocktailResult = {
  cocktailType: string;
  cocktailStyle: string;
  cocktailMainIngredients: string;
  cocktailSecondaryIngredients: string;
  selectedLanguage: LanguagesEnum;
};

export const config = {
  runtime: "edge",
};

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type MyCustomRequest = Override<
  NextApiRequest,
  { body: BodyGetOpenAiCocktailResult }
>;

const getPromt = (body: BodyGetOpenAiCocktailResult) => {
  const {
    cocktailType,
    cocktailStyle,
    cocktailMainIngredients,
    cocktailSecondaryIngredients,
    selectedLanguage,
  } = body;
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return `Dame una receta de cocteleria. Agrega los gramos o cantidades exactas de cada ingrediente. Dame el titulo, agrega "${SEPARATION_CHARACTERS}", después la lista de ingredientes,  agrega "${SEPARATION_CHARACTERS}", después el paso a paso para preparar. Se especifico en los detalles de la preparación, agrega la información nutrional al final de lo siguiente: Un coctel de tipo ${cocktailType} , que tenga un aroma y sabor ${cocktailStyle}, facil de hacer. Quiero que los licores principales sean ${cocktailMainIngredients}, y que también tenga ${cocktailSecondaryIngredients}. Quiero que sea una receta que se pueda preparar en menos de 10 minutos.`;
    case LanguagesEnum.en:
      return `Give me the title, then add "${SEPARATION_CHARACTERS}", then add list of ingredients, then add "${SEPARATION_CHARACTERS}", and then the step by step process to prepare it, add the exact quantities of ingredients. Be specific on the details of the process, add the nutritional information at the en of the the following: A  ${cocktailType} cocktail, that has easy to do, that has ${cocktailStyle} scent. And I want the main ingredient to be ${cocktailMainIngredients}, and that also has ${cocktailSecondaryIngredients}.I want it to take less than 10 minutes to prepare`;
  }
};
//

const getSystemCommand = ({
  selectedLanguage,
}: BodyGetOpenAiCocktailResult) => {
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return "Eres un mixologo, que es un experto haciendo recetas";
    case LanguagesEnum.en:
      return "You are a mixology, which is expert creating recipes";
  }
};

const handler = async (req: Request): Promise<Response> => {
  const body = (await req.json()) as BodyGetOpenAiCocktailResult;

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
