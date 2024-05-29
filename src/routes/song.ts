import { Router } from "express";
import {
  create,
  update,
  list,
  get,
  remove,
  upload,
  like,
  likedSongs,
} from "../controllers/song";
import { errorHandler } from "../error-handler";
import roleMiddleware from "../middlewares/role";
import { uploadFile } from "../middlewares/multer";

const songRoutes: Router = Router();

songRoutes.post("/", [roleMiddleware(["ARTIST"])], errorHandler(create));
songRoutes.post(
  "/upload",
  [roleMiddleware(["ARTIST"]), uploadFile.single("file")],
  errorHandler(upload)
);
songRoutes.put("/:id", [roleMiddleware(["ARTIST"])], errorHandler(update));
songRoutes.get("/", errorHandler(list));
songRoutes.get("/liked-songs", errorHandler(likedSongs));
songRoutes.get("/:id", errorHandler(get));
songRoutes.post("/:id/like", errorHandler(like));
songRoutes.delete("/:id", [roleMiddleware(["ARTIST"])], errorHandler(remove));

export default songRoutes;
