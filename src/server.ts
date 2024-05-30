import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./v1/routes";
import { errorMiddleware } from "./v1/middlewares/errors";

export default function createServer() {
  const app: Application = express();

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
  });

  app.use(express.json());

  app.use("/api/v1", routes);

  app.use(errorMiddleware);

  return app;
}
