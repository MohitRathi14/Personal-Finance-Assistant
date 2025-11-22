import mongoose from "mongoose";
import timestampe from "mongoose-timestamps";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },  
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
    verificationToken: {
        type: String 
    },
    verificationExpires: { 
        type: Date 
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.plugin(timestampe);

const User = mongoose.model('User', userSchema);
export default User;