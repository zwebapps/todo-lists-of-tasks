import app from './app';
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
console.log('PORT::::', PORT);

async function startServer() {
  try {
    await connectDB();
    console.log('Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please free it or use a different port.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1); // Exit app after error
    });

  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  }
}

startServer();


