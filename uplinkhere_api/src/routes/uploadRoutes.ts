// src/routes/uploadRoutes.ts
import { Router } from "express";
import { upload } from "../config/multer";
import { getUploadsForRequest, uploadFileToRequest } from "../controllers/UploadController";

const router = Router();

router.post("/:slug", upload.array("files", 10), uploadFileToRequest);
router.get("/:slug", getUploadsForRequest);

export default router;
