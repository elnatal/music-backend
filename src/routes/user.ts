import { Router } from "express";
import { adminUpdate, list, update } from "../controllers/user";
import { errorHandler } from "../error-handler";
import roleMiddleware from "../middlewares/role";

const userRoutes: Router = Router();

userRoutes.put("/", errorHandler(update));
userRoutes.put("/:id", [roleMiddleware(["ADMIN"])], errorHandler(adminUpdate));
userRoutes.get("/", [roleMiddleware(["ADMIN"])], errorHandler(list));

export default userRoutes;
