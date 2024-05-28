import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { UnprocessableEntityException } from "./exceptions/validation";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception: HttpException;

      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new UnprocessableEntityException(
          "Unprocessable entity",
          ErrorCode.UNPROCESSABLE_ENTITY,
          error
        );
      } else {
        exception = new InternalException(
          "Something went wrong.",
          ErrorCode.INTERNAL_EXCEPTION,
          error
        );
      }

      next(exception);
    }
  };
};
