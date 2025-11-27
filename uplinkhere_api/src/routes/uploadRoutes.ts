// src/routes/uploadRoutes.ts
import { Router } from "express";
import { upload } from "../config/multer";
import { downloadFile, getUploadsForRequest, uploadFileToRequest } from "../controllers/UploadController";

const router = Router();

router.post("/:slug", upload.array("files", 10), uploadFileToRequest);
router.get("/:slug", getUploadsForRequest);
router.get("/download/:fileName", downloadFile);

export default router;
