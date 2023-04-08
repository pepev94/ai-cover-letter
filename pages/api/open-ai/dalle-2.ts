import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { prompt },
  } = req;

  const session = await getServerSession(req, res, authOptions);

  if (session) {
    switch (method) {
      case "POST":
        try {
          const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY ?? ""}`,
              },
              method: "POST",
              body: JSON.stringify({ prompt, size: "256x256", n: 1 }),
            }
          );
          const data = await response.json();
          res.status(200).json({ data: data.data[0].url });
        } catch (error) {
          console.log(error);
          res.status(400).json({ success: false });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  } else {
    res.status(400).json({ success: false });
  }
}
