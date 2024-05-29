import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import genreRoutes from "./genre";
import songRoutes from "./song";
import authMiddleware from "../middlewares/auth";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/users", [authMiddleware], userRoutes);
rootRouter.use("/genres", [authMiddleware], genreRoutes);
rootRouter.use("/songs", [authMiddleware], songRoutes);

export default rootRouter;
