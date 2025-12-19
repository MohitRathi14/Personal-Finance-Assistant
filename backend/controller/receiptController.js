import Tesseract from "tesseract.js";
import * as pdfParse from "pdf-parse";
import fetch from "node-fetch";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import ImportHistory from "../model/importHistory.js";

// ------------------ Extractors ------------------

const extractAmount = (text) => {
    const regex = /(?:total|amount|amt|rs|₹)\s*[:\-]?\s*([0-9,]+(?:\.\d+)?)/i;
    const match = text.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, "")) : null;
};

const extractDate = (text) => {
    const regex = /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/;
    const match = text.match(regex);
    return match
        ? new Date(
            parseInt(match[1], 10),
            parseInt(match[2], 10) - 1,
            parseInt(match[3], 10)
        )
        : null;
};

const extractMerchant = (text) => {
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    return lines.length > 0 ? lines[0] : "Unknown Merchant";
};
const extractCategories = (text) => {
    const regex = /(?:categories|Categorie|Categories|categorie|category)\s*[:\-]?\s*(.*)/i;
    const match = text.match(regex);
    return match ?  match[1].split(",").map(c => c.trim()).join("")
        : "";
}
// ------------------ OCR helpers ------------------

const processImage = async (url) => {
    const result = await Tesseract.recognize(url, "eng");
    return result.data.text;
};

const processPDF = async (url) => {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const parser = pdfParse.default ?? pdfParse;
    const result = await parser(buffer);
    return result.text;
};

// ------------------ Controller ------------------

export const extractReceiptData = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ success: false, message: "Receipt file is required" });
        }

        // 1️⃣ Upload to Cloudinary (v2)
        const uploadToCloudinary = () =>
            new Promise((resolve, reject) => {
                const isPdf = req.file.mimetype === "application/pdf";

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "finance_assistant_receipts",
                        resource_type: isPdf ? "raw" : "image",
                        public_id: `${Date.now()}-${req.file.originalname}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

        const cloudinaryResult = await uploadToCloudinary();

        const fileUrl = cloudinaryResult.secure_url;
        const mime = req.file.mimetype;

        // 2️⃣ OCR / PDF extraction
        let extractedText;

        if (mime === "application/pdf") {
            extractedText = await processPDF(fileUrl);
        } else {
            extractedText = await processImage(fileUrl);
        }

        // 3️⃣ Data extraction
        const amount = extractAmount(extractedText);
        const date = extractDate(extractedText);
        const merchant = extractMerchant(extractedText);
        const category = extractCategories(extractedText);

        // 4️⃣ Save to DB
        await ImportHistory.create({
            userId: req.user.id,
            receiptUrl: fileUrl,
            rawText: extractedText,
            merchant,
            amount,
            date,
            category,
            status: "processed",
            cloudinaryPublicId: cloudinaryResult.public_id,
        });

        return res.status(200).send({
            success: true,
            message: "Receipt processed successfully",
            data: {
                cloudinaryUrl: fileUrl,
                merchant,
                amount,
                date,
                category
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "Error processing receipt",
        });
    }
};
export const getImportHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const history = await ImportHistory.find({ userId })
            .sort({ createdAt: -1 }); // Sort by the newest first
        return res.status(200).send({
            success: true,
            message: "Import history fetched successfully",
            receipts: history
        });
    }catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "Error fetching import history",
        });
    }
}