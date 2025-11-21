import mongoose from "mongoose";
import timestamps from "mongoose-timestamps";

const categorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,   
        required: true
    },
    type: { 
        type: String,
        enum: ['income', 'expense'],
        required: true
    }
});
categorySchema.plugin(timestamps);
const Category = mongoose.model('Category', categorySchema);
export default Category;