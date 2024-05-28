import { Router } from "express";
import { adminUpdate, list, update } from "../controllers/user";
import { errorHandler } from "../error-handler";
import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.put("/", errorHandler(update));
userRoutes.put("/:id", [adminMiddleware], errorHandler(adminUpdate));
userRoutes.get("/", [adminMiddleware], errorHandler(list));

export default userRoutes;
