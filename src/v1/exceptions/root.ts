export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 10001,
  USER_ALREADY_EXISTS = 10002,
  INCORRECT_PASSWORD = 10003,
  UNPROCESSABLE_ENTITY = 10004,
  INTERNAL_EXCEPTION = 10005,
  UNAUTHORIZED = 10006,
  YOU_CANT_CHANGE_YOUR_OWN_ACCOUNT_TYPE = 10007,
  GENRE_ALREADY_EXISTS = 10008,
  GENRE_NOT_FOUND = 10009,
  SONG_NOT_FOUND = 10010,
  FILE_NOT_FOUND = 10011,
  ERROR_UPLOADING_FILE = 10012,
  FILE_REQUIRED = 10013,
  INVALID_FILE_TYPE = 10014,
}
