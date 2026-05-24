/** Tunable limits for live People Finder (AI + web search). */

export function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
}

function envInt(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/** Server-side cap; client timeout should be slightly higher. */
export function finderSearchTimeoutMs(): number {
  const configured = envInt("HERMES_FINDER_TIMEOUT_MS", 0, 15_000, 300_000);
  if (configured > 0) return configured;
  return isVercelRuntime() ? 50_000 : 120_000;
}

export function finderMaxSteps(): number {
  const fallback = isVercelRuntime() ? 4 : 5;
  return envInt("HERMES_FINDER_STEPS", fallback, 3, 10);
}

export function finderMaxWebSearchUses(): number {
  const fallback = isVercelRuntime() ? 2 : 3;
  return envInt("HERMES_FINDER_WEB_SEARCH_USES", fallback, 1, 8);
}
