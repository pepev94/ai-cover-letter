import mongooseConnect from "@/lib/mongooseConnect";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    switch (method) {
      case "GET":
        try {
          const query = { email: session.user.email };
          const users = await User.find(query);
          res.status(200).json({ data: users });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case "POST":
        try {
          const user = await User.create(req.body);
          res.status(201).json({ data: user });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case "PUT":
        try {
          const user = await User.updateOne(
            { email: session.user.email },
            req.body
          );
          res.status(201).json({ data: user });
        } catch (error) {
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
