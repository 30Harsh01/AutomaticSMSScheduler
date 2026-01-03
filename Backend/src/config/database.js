// src/config/database.js
import mongoose from 'mongoose';

let isConnected = false; // Cache connection to prevent cold start issues

const connectDB = async () => {
    if (isConnected) {
        console.log('✅ MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGOURI, {
        });
        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1); // Exit if DB is unreachable
    }
};

export default connectDB;
