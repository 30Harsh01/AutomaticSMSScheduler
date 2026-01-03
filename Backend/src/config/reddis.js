// src/config/redis.js
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

let redisClient;
let isRedisConnected = false;

const connectRedis = async () => {
  if (isRedisConnected) return redisClient;

  redisClient = createClient({
    username: 'default', // Required by Redis Cloud
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      reconnectStrategy: retries => Math.min(retries * 100, 3000),
    },
  });

  redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
  redisClient.on('connect', () => console.log('🔗 Redis connecting...'));
  redisClient.on('ready', () => console.log('✅ Redis ready'));
  redisClient.on('end', () => console.log('⚠️ Redis connection closed'));

  await redisClient.connect();
  isRedisConnected = true;
  console.log('✅ Redis Cloud connected');

  return redisClient;
};

export { redisClient, connectRedis };
