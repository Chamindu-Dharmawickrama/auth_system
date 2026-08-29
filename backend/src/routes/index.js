import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import notesRouter from "../modules/notes/notes.routes.js";

const router = Router();

router.use("/auth", authRouter)
router.use("/notes", notesRouter)

export default router;
