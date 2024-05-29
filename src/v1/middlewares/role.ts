import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { AccountType } from "@prisma/client";
const roleMiddleware = (roles: [AccountType]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.user.accountType)) {
      next();
      return;
    }
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  };
};

export default roleMiddleware;
