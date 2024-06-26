import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import prismaClient from "../utils/prisma";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if token is not present, throw unauthorized exception
  if (!req.headers.authorization) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  }

  // extract the token from the header
  let tokenParts = req.headers.authorization.split(" ");
  
  let token = tokenParts[tokenParts.length - 1];

  try {
    // if token is present, validate and extract the payload
    const payload: any = jwt.verify(token, JWT_SECRET);

    // get user
    const user = await prismaClient.user.findFirst({
      where: { id: payload.id },
    });

    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
      return;
    }

    // attach the user to the current request
    req.user = user;
    next();
    return;
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  }
};

export default authMiddleware;
