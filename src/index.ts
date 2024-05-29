import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
