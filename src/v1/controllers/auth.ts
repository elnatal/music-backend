import { Request, Response } from "express";
import firebaseClient from "../utils/firebase";
import * as jwt from "jsonwebtoken";
import { FIREBASE_WEB_KEY, JWT_SECRET } from "../../secrets";
import { AuthSchema, GetIdTokenSchema } from "../schema/auth";
import prismaClient from "../utils/prisma";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import axios from "axios";

export const auth = async (req: Request, res: Response) => {
  // validate the incoming data
  AuthSchema.parse(req.body);

  const { idToken } = req.body;

  let decodedToken: any;

  try {
    // validate firebase token
    decodedToken = await firebaseClient.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

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
    expiresIn: "3h",
  });

  // Send the response
  res.json({
    user: {
      id: user.id,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
      createdAt: user.createdAt,
    },
    token,
  });
};

export const me = (req: Request, res: Response) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      dateOfBirth: req.user.dateOfBirth,
      accountType: req.user.accountType,
      createdAt: req.user.createdAt,
    },
  });
};

export const getIdToken = async (req: Request, res: Response) => {
  // validate the incoming data
  let validatedData = GetIdTokenSchema.parse(req.body);
  try {
    let response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_KEY}`,
      {
        email: validatedData.email,
        password: validatedData.password,
        returnSecureToken: true,
      }
    );

    res.json({
      idToken: response.data.idToken,
    });
  } catch (error) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
};
