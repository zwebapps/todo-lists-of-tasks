import './app';
import dotenv from 'dotenv';
import { connectDB } from './db';
dotenv.config();

console.info("---------------------")
console.log(process.env.MONGO_URI);
console.log(process.env.MONGO_ROOT_USERNAME);
console.log(process.env.MONGO_ROOT_PASSWORD);
console.log(process.env.MONGO_DATABASE);
console.log(process.env.MONGO_PORT);
console.info("---------------------")

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  require('./app').listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err: any) => {
  console.error('Failed to connect to database. Shutting down.', err);
});
