import mongooseConnect from "@/lib/mongooseConnect";
import User from "@/models/User";
import StripeToken from "@/models/StripeToken";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { stripeToken },
  } = req;

  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    switch (method) {
      case "POST":
        try {
          const existingToken = await StripeToken.findOne({
            token: stripeToken,
          });
          if (existingToken) {
            res.status(400).json({ success: false });
            return;
          }
          let user = await User.findOne({ email: session.user.email });
          await StripeToken.create({
            token: stripeToken,
            user_id: user?._id,
          });
          const updatedUser = await User.updateOne(
            { email: session.user.email },
            { subscriptionId: stripeToken }
          );
          res.status(201).json({ data: updatedUser });
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
