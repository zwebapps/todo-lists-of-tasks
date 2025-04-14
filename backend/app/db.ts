import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//const MONGO_URI=`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

const MONGO_URI = process.env.MONGO_URI;

console.info("MONGO URI ::::", MONGO_URI)

export const connectDB = async (): Promise<void> => {
  try {
    console.log('connectDB  => MONGO_URI', MONGO_URI)
    // Connect to MongoDB using mongoose
    await mongoose.connect(MONGO_URI);
    console.info('MongoDB connected successfully');

    // Optional: Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export the mongoose connection instance if needed
export const dbConnection = mongoose.connection;
