import connectionDB from "./connection.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createAdminUser } from './createAdmin.js';
import userRoutes from './routes/user.js';
import receiptRoutes from './routes/receiptRoute.js';
import authRoutes from './routes/authRoute.js';
import paymentRoutes from './routes/paymentRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - MUST come BEFORE routes
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectionDB();

// Create admin user
createAdminUser();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
