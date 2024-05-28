import { Router } from "express";
import { changeAccountType, listUsers, update } from "../controllers/user";
import { errorHandler } from "../error-handler";
import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.put("/update", errorHandler(update));
userRoutes.post("/change-account-type", [adminMiddleware], errorHandler(changeAccountType));
userRoutes.get("/list", [adminMiddleware], errorHandler(listUsers));

export default userRoutes;
