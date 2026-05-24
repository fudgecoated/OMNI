import { loadEnv } from "./config/loadEnv";
import { createApp } from "./app";

loadEnv();

/** Default export for Vercel Express serverless (@vercel/node). */
export default createApp();
