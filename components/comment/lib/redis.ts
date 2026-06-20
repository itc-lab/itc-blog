import Redis from 'ioredis';

class ClientRedis {
  static instance: Redis | undefined;

  private constructor() {
    throw new Error('Use ClientRedis.getInstance()');
  }

  static getInstance(): Redis {
    if (!ClientRedis.instance) {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        throw new Error('REDIS_URL is not configured.');
      }

      ClientRedis.instance = new Redis(redisUrl);
    }

    return ClientRedis.instance;
  }
}

const redis = ClientRedis.getInstance();

export default redis;
