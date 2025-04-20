import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import morgan from 'morgan';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.use(morgan('dev'));
app.use('/api', (req, res, next) => {
  console.log(`🔹 Request reached /api: ${req.method} ${req.url}`);
  next();
}, todoRoutes);


export default app;

