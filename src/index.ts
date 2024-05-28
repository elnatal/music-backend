import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(express.json());

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

export const firebaseClient = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
