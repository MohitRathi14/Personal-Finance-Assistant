import paymentController from '../controller/paymentController.js';
import express from 'express';
const router = express.Router();

// Add transaction route
router.post('/add-transaction', (req, res) => paymentController.createTransaction(req, res));
// Get user transactions route
router.get('/user-transactions', (req, res) => paymentController.getUserTransactions(req, res));
// Get all transactions route
router.get('/all-transactions', (req, res) => paymentController.getAllTransactions(req, res));
// Delete transaction route
router.delete('/delete-transaction/:id', (req, res) => paymentController.deleteTransaction(req, res));

// vrerify transaction route
router.post('/verify-transaction', (req, res) => paymentController.verifyTransaction(req, res));

// edit transaction route
router.put('/edit-transaction/:id', (req, res) => paymentController.editTransaction(req, res));

//filter by date route
router.post('/filter-by-date', (req, res) => paymentController.filterByDate(req, res));

//category based summary route
router.get('/category-summary', (req, res) => paymentController.categoryBasedSummary(req, res));

//graph data route
router.get('/graph-data', (req, res) => paymentController.graphData(req, res));


// Export the router
export default router;