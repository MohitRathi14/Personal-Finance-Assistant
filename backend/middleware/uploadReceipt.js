import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "finance_assistant_receipts",
    format: async (req, file) => {
      if (file.mimetype === "application/pdf") return "pdf";
      return file.mimetype.split("/")[1];
    },
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

export const uploadReceipt = multer({ storage });
