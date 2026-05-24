import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../../server/src/index";

type VercelHandler = (req: VercelRequest, res: VercelResponse) => unknown | Promise<unknown>;

let cached: VercelHandler | null = null;

/** Shared Express app for all /api/* Vercel serverless routes. */
export function getApiHandler(): VercelHandler {
  if (!cached) {
    cached = serverless(createApp()) as VercelHandler;
  }
  return cached;
}
