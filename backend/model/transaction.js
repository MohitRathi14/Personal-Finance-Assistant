import mongoose from "mongoose";
import timestamps from "mongoose-timestamps";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
});
transactionSchema.plugin(timestamps);
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;