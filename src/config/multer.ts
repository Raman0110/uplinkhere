import multer from "multer"

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});