import express from 'express';
import * as receiptController from '../controller/receiptController.js';
import { uploadReceipt } from '../middleware/uploadReceipt.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/extract-receipt', authenticateUser, uploadReceipt.single('receipt'), receiptController.extractReceiptData);
router.get('/history', authenticateUser, receiptController.getImportHistory)

export default router;