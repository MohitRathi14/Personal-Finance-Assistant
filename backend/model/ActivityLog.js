import mongoose from "mongoose";

// Define the schema for ActivityLog
const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the ActivityLog model
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;