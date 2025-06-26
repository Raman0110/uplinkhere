import { Router } from "express";
import { createOrLoginUser, getCurrentUser } from "../controllers/UserController";

const router = Router();

router.post("/", createOrLoginUser);
router.get("/", getCurrentUser);

export default router;
