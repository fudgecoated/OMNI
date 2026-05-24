import type { Request, Response, NextFunction } from "express";

const LOCAL_DEV_ORIGIN =
  /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):517\d$/;

function isAllowedOrigin(origin?: string): origin is string {
  if (!origin) return false;

  const configuredOrigin = process.env.WEB_ORIGIN?.trim();
  return origin === configuredOrigin || LOCAL_DEV_ORIGIN.test(origin);
}

export function corsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (isAllowedOrigin(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}
