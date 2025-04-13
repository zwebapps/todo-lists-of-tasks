import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db';
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/api', todoRoutes);

// Connect to the database
connectDB().then(() => {
  // Start your server after successful connection
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err: any) => {
  console.error('Failed to connect to database. Shutting down.', err);
});

export default app;

