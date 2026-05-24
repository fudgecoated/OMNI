/** JSON fetch helper used by finder, profile ingest, tracker, and other API calls. */

export type ApiFetchOptions = RequestInit & { timeoutMs?: number };

/**
 * Resolve API path to a full URL.
 * In dev we call Express on :3002 directly (CORS allowed) so requests work even if the Vite proxy misbehaves.
 * Set VITE_API_URL to override (e.g. production API host).
 */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv?.trim()) {
    return `${fromEnv.replace(/\/$/, "")}${normalized}`;
  }
  if (import.meta.env.DEV) {
    const port = (import.meta.env.VITE_API_PORT as string | undefined) ?? "3002";
    return `http://127.0.0.1:${port}${normalized}`;
  }
  return normalized;
}

async function parseJsonResponse<T>(res: Response, url: string): Promise<T> {
  const text = await res.text();
  const trimmed = text.trimStart();

  if (trimmed.startsWith("<")) {
    throw new Error(
      `API returned HTML instead of JSON (${url}). Start the backend with pnpm dev — server should be on http://localhost:3002.`
    );
  }

  let body: unknown;
  try {
    body = trimmed ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid JSON from ${url}`);
  }

  if (!res.ok) {
    const err = body as { error?: string };
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return body as T;
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const { timeoutMs = 60_000, ...fetchInit } = init ?? {};
  const url = apiUrl(path);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchInit.headers,
      },
    });
    return await parseJsonResponse<T>(res, url);
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        `Request timed out after ${Math.round(timeoutMs / 1000)}s. The server may still be working — try again in a moment.`
      );
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
