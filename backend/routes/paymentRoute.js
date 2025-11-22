import express from 'express';
import * as paymentController from '../controller/paymentController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/add-transaction', authenticateUser, paymentController.createTransaction);
router.get('/user-transactions', authenticateUser, paymentController.getUserTransactions);
router.get('/all-transactions', authenticateUser, paymentController.getAllTransactions);
router.delete('/delete-transaction/:id', authenticateUser, paymentController.deleteTransaction);
router.post('/verify-transaction/:id', authenticateUser, paymentController.verifyTransaction);
router.put('/edit-transaction/:id', authenticateUser, paymentController.editTransaction);
router.post('/filter-by-date', authenticateUser, paymentController.filterTransactionsByDate);
router.get('/category-summary', authenticateUser, paymentController.categoryBasedSummary);
router.get('/graph-data', authenticateUser, paymentController.getGraphData);

export default router;