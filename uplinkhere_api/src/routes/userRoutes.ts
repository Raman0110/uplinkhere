import { Router } from "express";
import { createOrLoginUser, getCurrentUser } from "../controllers/UserController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/", createOrLoginUser);
router.get("/", requireAuth, getCurrentUser);

export default router;
