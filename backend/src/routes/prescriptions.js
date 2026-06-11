import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import * as store from "../lib/store.js";
import { HttpError, shortId } from "../lib/utils.js";

const router = Router();

const PRESCRIPTION_STATUSES = ["uploaded", "under-review", "approved", "rejected"];

// backend/uploads — created at boot so multer always has a destination.
const uploadDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "uploads"
);
mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|pdf)$/i;

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^\w.-]+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Only jpg, jpeg, png, webp or pdf files are allowed (max 5 MB)"));
    }
  },
});

// GET /api/prescriptions
router.get("/", (req, res) => {
  res.json(store.all("prescriptions"));
});

/**
 * POST /api/prescriptions
 * Preferred: multipart/form-data with single file field "file" (stored under
 * backend/uploads). Fallback: JSON body { fileName, fileType } so the API is
 * testable without multipart. Optional fields: doctorName, note.
 */
router.post("/", upload.single("file"), (req, res) => {
  const body = req.body ?? {};
  let fileName;
  let fileType;
  let storedAs;

  if (req.file) {
    fileName = req.file.originalname;
    fileType =
      req.file.mimetype === "application/pdf" || /\.pdf$/i.test(fileName) ? "pdf" : "image";
    storedAs = req.file.filename;
  } else {
    fileName = body.fileName;
    if (!fileName) {
      throw new HttpError(400, 'Upload a "file" (multipart) or provide { fileName } as JSON');
    }
    fileType = body.fileType === "pdf" || /\.pdf$/i.test(fileName) ? "pdf" : "image";
  }

  const prescription = {
    id: `rx-${shortId()}`,
    fileName,
    fileType,
    uploadedOn: new Date().toISOString(),
    status: "under-review",
    note: body.note ?? "Our pharmacist will review this within 2 hours.",
    ...(body.doctorName ? { doctorName: body.doctorName } : {}),
    ...(storedAs ? { storedAs } : {}),
  };

  store.insert("prescriptions", prescription, { prepend: true });
  res.status(201).json(prescription);
});

// PATCH /api/prescriptions/:id/status { status, note? }
router.patch("/:id/status", (req, res) => {
  const { status, note } = req.body ?? {};
  if (!PRESCRIPTION_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${PRESCRIPTION_STATUSES.join(", ")}`);
  }
  const prescription = store.update("prescriptions", req.params.id, {
    status,
    ...(note !== undefined ? { note } : {}),
  });
  if (!prescription) throw new HttpError(404, `Prescription "${req.params.id}" not found`);
  res.json(prescription);
});

export default router;
