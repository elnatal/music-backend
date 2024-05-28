import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.accountType == "ADMIN") {
    next();
    return;
  }
  next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  return;
};

export default adminMiddleware;
