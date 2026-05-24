import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getApiHandler } from "./_handler";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return getApiHandler()(req, res);
}
