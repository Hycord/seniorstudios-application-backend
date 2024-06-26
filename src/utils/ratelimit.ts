import { NextFunction, Request, Response } from "express";
import redis from "~utils/cache";

export function CreateRateLimit(
  channel: string,
  rate: number,
  ttl: number
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req, res, next) => {
    const ip = req.clientIp;

    if (!ip) {
      console.warn(
        "Unable to check IP for incoming request. Rate-limiting applied for safety."
      );
      res.status(429).json({ retry: -1 });
      return;
    }

    const key = `rate-limit::${channel}::${ip}`;
    console.log(key);

    const limit = Number((await redis.get(key)) ?? "0");

    if (limit == 0) {
      await redis.set(key, 1, "EX", ttl);
    } else await redis.set(key, limit + 1, "KEEPTTL");

    if (limit > rate) {
      // 30 requests per 60 seconds
      const curTTL = await redis.ttl(key);
      res.status(429).json({ retry: curTTL });
      return;
    }

    next();
  };
}
