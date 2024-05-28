import { Router } from "express";
import { create, update, list, get, remove } from "../controllers/genre";
import { errorHandler } from "../error-handler";
import adminMiddleware from "../middlewares/admin";

const genreRoutes: Router = Router();

genreRoutes.post("/", [adminMiddleware], errorHandler(create));
genreRoutes.put("/:id", [adminMiddleware], errorHandler(update));
genreRoutes.get("/", errorHandler(list));
genreRoutes.get("/:id", errorHandler(get));
genreRoutes.delete("/:id", [adminMiddleware], errorHandler(remove));

export default genreRoutes;
