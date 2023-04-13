import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        let { url } = req.query;
        const result = await fetch(url as string);
        const text = await result.text();
        res.status(200).json({ data: text });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      break;
    case "PUT":
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
