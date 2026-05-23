import express from "express";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { finderRouter } from "./routes/finder";
import { messagesRouter } from "./routes/messages";
import { contactsRouter } from "./routes/contacts";
import { chatRoute } from "./routes/chat";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "hermes-server" });
  });

  app.post("/api/chat", (req, res, next) => {
    void chatRoute(req, res).catch(next);
  });

  app.use("/api", finderRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

if (process.env.VITEST !== "true") {
  const port = Number(process.env.PORT) || 3002;
  const server = app.listen(port, () => {
    console.log(`Hermes server running on http://localhost:${port}`);
  });
  process.on("SIGTERM", () => server.close());
}

export default app;
