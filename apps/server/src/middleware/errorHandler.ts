import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Error:", err.message);

  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const lower = err.message.toLowerCase();
  if (
    lower.includes("anthropic_api_key") &&
    (lower.includes("required") ||
      lower.includes("missing") ||
      lower.includes("set"))
  ) {
    statusCode = 500;
    message = "Missing ANTHROPIC_API_KEY. Add it to .env and restart the server.";
  } else if (lower.includes("api key") || lower.includes("authentication")) {
    statusCode = 401;
    message = "Invalid API key";
  } else if (lower.includes("rate limit") || lower.includes("429")) {
    statusCode = 429;
    message = "Rate limit reached";
  } else if (statusCode >= 500 && !(err instanceof AppError)) {
    message = "Something went wrong";
  }

  res.status(statusCode).json({ error: message });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}
