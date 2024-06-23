import { RedisKey } from '@/constants.js';
import { candlestickSchema, type CandlestickDto } from '@/dtos/market.dto.js';
import type { FastifyRedis } from '@fastify/redis';
import z from 'zod';

export class MarketService {
  /**
   * Parse kline topic
   * @param redisKeys
   * @param redis
   *
   * @throws {ZodError} when parsing fails
   * @throws {Error} when fetching data fails
   */
  static async parseKlineTopic(
    redisKeys: [RedisKey, RedisKey],
    redis: FastifyRedis,
  ): Promise<{ confirmedCandlesticks: CandlestickDto[]; latestCandlestick: CandlestickDto }> {
    const pipeline = redis.pipeline();
    pipeline.lrange(redisKeys[0], 0, -1);
    pipeline.get(redisKeys[1]);
    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Failed to fetch data from Redis');
    }

    const topic24h = (results[0]?.[1] as string[]).map((item: string) => JSON.parse(item));
    const topic1m = JSON.parse(results[1]?.[1] as string);

    const parsedTopic24h = z.array(candlestickSchema).safeParse(topic24h);
    const parsedTopic1m = candlestickSchema.safeParse(topic1m);

    if (!parsedTopic24h.success || !parsedTopic1m.success) {
      throw parsedTopic24h.error || parsedTopic1m.error;
    }

    return {
      confirmedCandlesticks: parsedTopic24h.data,
      latestCandlestick: parsedTopic1m.data,
    };
  }
}
