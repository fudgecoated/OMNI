import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getApiHandler } from "./_handler";

export const config = {
  maxDuration: 60,
};

/** All /api/* routes (except /api/health) are rewritten here — see vercel.json. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return getApiHandler()(req, res);
}
