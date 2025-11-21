import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import fetch from "node-fetch";
import ImportHistory from "../model/importHistory.js";

// Extractors
const extractAmount = (text) => {
    const regex = /(?:total|amount|amt|rs|₹)\s*[:\-]?\s*(\d+\.?\d*)/i;
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
};

const extractDate = (text) => {
    const regex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/;
    const match = text.match(regex);
    return match ? new Date(match[1]) : null;
};

const extractMerchant = (text) => {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);
    return lines.length > 0 ? lines[0] : "Unknown Merchant";
};

// OCR helper for images
const processImage = async (url) => {
    const result = await Tesseract.recognize(url, "eng");
    return result.data.text;
};

// PDF helper for remote PDF
const processPDF = async (url) => {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const result = await pdfParse(buffer);
    return result.text;
};

// Controller
export const extractReceiptData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: "Receipt file is required" });
        }

        const fileUrl = req.file.path;
        const mime = req.file.mimetype;

        let extractedText = "";

        if (mime === "application/pdf") {
            extractedText = await processPDF(fileUrl);
        } else {
            extractedText = await processImage(fileUrl);
        }

        const amount = extractAmount(extractedText);
        const date = extractDate(extractedText);
        const merchant = extractMerchant(extractedText);

        // save into database
        const history = await ImportHistory.create({
            userId: req.user.id,
            receiptUrl: fileUrl,
            rawText: extractedText,
            merchant,
            amount,
            date,
            status: "processed"
        });

        return res.status(200).send({
            success: true,
            message: "Receipt processed successfully",
            data: {
                cloudinaryUrl: fileUrl,
                rawText: extractedText,
                merchant,
                amount,
                date
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error processing receipt" });
    }
};
