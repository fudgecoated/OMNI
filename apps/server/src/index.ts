import { loadEnv } from "./config/loadEnv";

loadEnv();

import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { finderRouter } from "./routes/finder";
import { messagesRouter } from "./routes/messages";
import { contactsRouter } from "./routes/contacts";
import { chatRoute } from "./routes/chat";
import { profileChatRoute } from "./routes/profileChat";
import { profileIngestRoute } from "./routes/profileIngest";

export function createApp(): Express {
  const app: Express = express();

  app.use(express.json());
  app.use(corsMiddleware());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "hermes-server" });
  });

  app.post("/api/chat", (req: Request, res: Response, next: NextFunction) => {
    void chatRoute(req, res).catch(next);
  });

  app.post("/api/profile/chat", (req: Request, res: Response, next: NextFunction) => {
    void profileChatRoute(req, res).catch(next);
  });

  app.post("/api/profile/ingest", (req: Request, res: Response, next: NextFunction) => {
    void profileIngestRoute(req, res).catch(next);
  });

  // Register specific /api/* routers before the generic /api finder mount.
  app.use("/api/contacts", contactsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api", finderRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

const shouldListen =
  process.env.VITEST !== "true" &&
  !process.env.VERCEL &&
  !process.env.VERCEL_ENV;

if (shouldListen) {
  const port = Number(process.env.PORT) || 3002;
  const server = app.listen(port, () => {
    console.log(`Hermes server running on http://localhost:${port}`);
  });
  process.on("SIGTERM", () => server.close());
}

export default app;
