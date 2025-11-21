import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('Connected to MongoDB');
  }
    catch (error) {
      // Log any connection errors
    console.error('Error connecting to MongoDB:', error);
  }
};
export default connectionDB;