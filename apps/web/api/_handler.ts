import type { Handler } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../../server/src/index";

let cached: Handler | null = null;

/** Shared Express app for all /api/* Vercel serverless routes. */
export function getApiHandler(): Handler {
  if (!cached) {
    cached = serverless(createApp()) as Handler;
  }
  return cached;
}
