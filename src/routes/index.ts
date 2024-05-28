import { Router } from "express";
import authRoutes from "./auth";
import authMiddleware from "../middlewares/auth";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);

export default rootRouter;
