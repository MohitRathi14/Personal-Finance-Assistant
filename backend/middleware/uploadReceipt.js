import multer from "multer";

export const uploadReceipt = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only images and PDFs are allowed"), false);
        }

        cb(null, true);
    },
});
