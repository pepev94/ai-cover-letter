// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream } from "@/utils/OpenAIStream";
import type { NextApiRequest } from "next";

export enum LanguagesEnum {
  es = "es",
  en = "en",
}

export type BodyGetOpenAiResult = {
  currentCV: string;
  jobDescription: string;
  selectedLanguage: LanguagesEnum;
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
  const { currentCV, jobDescription, selectedLanguage } = body;
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return `Primero quiero que me des recomendaciones a mi CV para encajar mejor en la descripcion del puesto. Luego agrega ${SEPARATION_CHARACTERS}. Y finalmente quiero que escribas la mejor carta de presentación utilizando mi CV: \n${currentCV}. La descripción del trabajo es: ${jobDescription}. Hazlo directo al punto. Toma en consideración los requisitos que se mencionan en la descripción del trabajo, haz coincidir esos requisitos con mi CV y elimina todo lo que no coincida con la descripción del trabajo.`;
    case LanguagesEnum.en:
      return `First I want you to give recomendations on my CV to match better the job description. Then add ${SEPARATION_CHARACTERS}. I want you to write the best cover letter using my cv: \n ${currentCV}. And the job description is: ${jobDescription}.  Make it straight to the point. Take into consideration the requirements that the job descriptions says, match them with my CV, and remove anything that doesnt match with the job descrition.`;
  }
};
//

const getSystemCommand = ({ selectedLanguage }: BodyGetOpenAiResult) => {
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return "Eres el curador de CV. Tienes 20 años de experiencia en ayudar a las personas a conseguir trabajo haciendo un CV y una carta de presentación personalizados.";
    case LanguagesEnum.en:
      return "You are the CV curator. You have 20 years of experience in helping persons getting into job by making a Taylor made CV and Cover letter";
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
    temperature: body.selectedLanguage === LanguagesEnum.es ? 0.85 : 0.2,
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
