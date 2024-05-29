import express, { Express } from "express";
import { PORT } from "./secrets";
import v1Router from "./v1/routes";
import { errorMiddleware } from "./v1/middlewares/errors";

const app: Express = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
