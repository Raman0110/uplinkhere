// src/routes/uploadRoutes.ts
import { Router } from "express";
import { upload } from "../config/multer";
import { deleteUpload, downloadFile, getUploadsForRequest, uploadFileToRequest } from "../controllers/UploadController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/:slug", upload.array("files", 10), uploadFileToRequest);
router.get("/:slug", requireAuth, getUploadsForRequest);
router.get("/download/:id", requireAuth, downloadFile);
router.delete("/:id", requireAuth, deleteUpload);

export default router;
