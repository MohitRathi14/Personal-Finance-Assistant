import mongoose from "mongoose";
import timestamps from "mongoose-timestamps";

const importHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiptUrl: {
        type: String,
        required: true  
    },
    rawText:{
        type: String,
    },
    merchant: {
        type: String,
    }
    ,
    amount: {
        type: Number,
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['processed', 'completed', 'failed'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
importHistorySchema.plugin(timestamps);
const ImportHistory = mongoose.model('ImportHistory', importHistorySchema);
export default ImportHistory;