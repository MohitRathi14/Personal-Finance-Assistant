import connectionDB from "./connection";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createAdminUser from './createAdmin'
import userRoutes from './routes/user.js';
import receiptRoutes from './routes/receiptRoute.js';
import authRoutes from './routes/authRoute.js';
import paymentRoutes from './routes/paymentRoute.js';
// Load environment variables from .env file
dotenv.config();
const app = express();
// Use the PORT from environment variables
const PORT = process.env.PORT ;

// Create the conection to the database
connectionDB();

// Create the Admin user
createAdminUser();

app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    method : ['GET','POST','PUT','DELETE'],
    credentials:true
}
));


app.use(express.json());

// create the server
app.listen(PORT, (err) => {
    if (err) {
    console.error('Error starting server:', err);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});