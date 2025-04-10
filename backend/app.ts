import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/api', todoRoutes);

const MONGO_URI=`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
console.info("================================");
console.info("MONGO_URI => ", MONGO_URI);
console.info("================================");

mongoose.connect(MONGO_URI || '', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

export default app;

