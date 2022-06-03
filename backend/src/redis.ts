import Client from "ioredis";

export const redisClient = new Client({ host: process.env.REDIS_HOST });
