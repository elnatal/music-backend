import { HttpException } from "./root";

export class UnprocessableEntityException extends HttpException {
  constructor(message: string, errorCode: number, errors: any) {
    super(message, errorCode, 422, errors);
  }
}
