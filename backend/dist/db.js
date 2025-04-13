"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
const connectDB = async () => {
    try {
        console.log('MONGO_URI', MONGO_URI);
        // Connect to MongoDB using mongoose
        await mongoose_1.default.connect(MONGO_URI);
        console.info('MongoDB connected successfully');
        // Optional: Listen for connection events
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Export the mongoose connection instance if needed
exports.dbConnection = mongoose_1.default.connection;
//# sourceMappingURL=db.js.map