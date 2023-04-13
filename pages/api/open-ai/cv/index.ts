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

const extra =
  "Im a software developer with more than 7 years of experience. I am more frontennd incline, I have also founded startups in the past, and sold one named la mercaderia. I get invooved in the bussiness side to translate everything to code. I like to focus heavy on the client side instead of the code, cause I think that many software developers only focus on the code and do not understand the bussiness side of things. I am very creative.";

const getPromt = (body: BodyGetOpenAiResult) => {
  const { currentCV, jobDescription, selectedLanguage } = body;
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return `Este es mi CV: \n ${currentCV}. Quiero que me personalices mi CV a la siguiente posicion: ${jobDescription}. Escribelo en codigo LATEX:`;
    case LanguagesEnum.en:
      return `I want you to write the best cover letter using my cv: \n ${currentCV}. And the job description is: ${jobDescription}.  Make it straight to the point. Take into consideration the requirements that the job descriptions says, match them with my CV, and remove anything that doesnt match with the job descrition`;
  }
};
//

const getSystemCommand = ({ selectedLanguage }: BodyGetOpenAiResult) => {
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return "Eres el mejor redactor de CV";
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
