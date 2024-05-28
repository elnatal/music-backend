import { Router } from "express";
import { auth } from "../controllers/auth";
import { errorHandler } from "../error-handler";

const authRoutes: Router = Router();

authRoutes.post("/", errorHandler(auth));

export default authRoutes;
