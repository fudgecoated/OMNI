import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Lightweight health check without loading the full Express app. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: "ok", service: "hermes-server" });
}
