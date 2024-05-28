import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import authMiddleware from "../middlewares/auth";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/users", [authMiddleware], userRoutes);

export default rootRouter;
