import { Request, Response } from "express";
import firebaseClient from "../utils/firebase";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { SignupSchema } from "../schema/auth";
import prismaClient from "../utils/prisma";

export const auth = async (req: Request, res: Response) => {
  // validate the incoming data
  SignupSchema.parse(req.body);

  const { idToken } = req.body;

  // validate firebase token
  const decodedToken = await firebaseClient.auth().verifyIdToken(idToken);

  // Check if the user exists in the database
  let user = await prismaClient.user.findFirst({
    where: { firebaseId: decodedToken.uid },
  });

  if (!user) {
    // create a new user
    user = await prismaClient.user.create({
      data: {
        firebaseId: decodedToken.uid,
      },
    });
  }

  // generate a token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  // Send the response
  res.json({ user, token });
};

export const me = (req: Request, res: Response) => {
  res.json(req.user);
};
