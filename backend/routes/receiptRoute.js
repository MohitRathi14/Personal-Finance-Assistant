import receipt from '../controllers/receiptController.js';
import express from 'express';
const router = express.Router();

// Generate receipt route
router.post('/extract-receipt',(req,res)=> receipt.extractReceiptData(req,res));

export default router;