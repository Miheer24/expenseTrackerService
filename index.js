import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./database/connection";
import expenseRouter from "./routes/expense/expense.router";
import authRouter from "./routes/auth/auth.router";
import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
app.use(express.json()); // middleware for parsing JSON
app.use("/auth", authRouter); // auth router
app.use("/expense", authMiddleware, expenseRouter); // expense router

const PORT = process.env.PORT || 8080;
const USE_HTTPS = process.env.USE_HTTPS === "true";
const CERT_PATH =
  process.env.SSL_CERT_PATH || path.resolve("certs", "server.crt");
const KEY_PATH =
  process.env.SSL_KEY_PATH || path.resolve("certs", "server.key");

const startServer = async () => {
  await connectDB(); // Connect to mongo DB on app start up

  if (USE_HTTPS) {
    if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
      console.error(
        "HTTPS enabled but certificate or key file not found. Falling back to HTTP.",
      );
    } else {
      const httpsOptions = {
        key: fs.readFileSync(KEY_PATH),
        cert: fs.readFileSync(CERT_PATH),
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.info(`Service listening on https://localhost:${PORT}`);
      });
      return;
    }
  }

  app.listen(PORT, () => {
    console.info(`Service listening on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
