import { loadEnv } from "./config/loadEnv";
import { createApp } from "./app";

loadEnv();

export { createApp } from "./app";
export { default as vercelApp } from "./vercelApp";

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
