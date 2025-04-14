import express from 'express';
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

module.exports = app;

