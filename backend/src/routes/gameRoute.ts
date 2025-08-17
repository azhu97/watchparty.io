import { Router } from "express";
import { getAllGames, getGameById } from "../controllers/gameController";

const router = Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);

export default router;
