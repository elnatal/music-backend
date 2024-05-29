import express, { Express } from "express";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_SECRET_KEY,
  PORT,
} from "./secrets";
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

const cloudinaryInstance = require("cloudinary").v2;

cloudinaryInstance.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

export const cloudinary = cloudinaryInstance;

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use("/api", rootRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
