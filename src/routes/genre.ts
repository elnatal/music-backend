import { Router } from "express";
import { create, update, list, get, remove } from "../controllers/genre";
import { errorHandler } from "../error-handler";
import roleMiddleware from "../middlewares/role";

const genreRoutes: Router = Router();

genreRoutes.post("/", [roleMiddleware(["ADMIN"])], errorHandler(create));
genreRoutes.put("/:id", [roleMiddleware(["ADMIN"])], errorHandler(update));
genreRoutes.get("/", errorHandler(list));
genreRoutes.get("/:id", errorHandler(get));
genreRoutes.delete("/:id", [roleMiddleware(["ADMIN"])], errorHandler(remove));

export default genreRoutes;
