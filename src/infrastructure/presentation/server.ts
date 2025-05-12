// import { connectToMongoAtlas } from "./infrastructure/DB/mongo.config";
import { Application, NextFunction, Response } from "express-serve-static-core";
import { serverMiddlewareConfig } from "./middleware/express";
import { Server_Config } from "configs/server/Server.Config";
import express, { Request } from "express";
import { createServer } from "http";

export class Server {
  private app: Application;
  private config: ReturnType<typeof Server_Config>;
  private server: ReturnType<typeof createServer>;
  //   private io: ReturnType<typeof createSocketServer>;
  private readonly maxRetries: number;

  constructor() {
    this.app = express();
    this.initialize();
    this.server = createServer(this.app);
    this.config = Server_Config();
    this.setupErrorHandlers();
    this.maxRetries = 10;
  }

  private initialize(): void {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  private setupMiddleware(): void {
    serverMiddlewareConfig(this.app);
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  private setupRoutes(): void {
    this.app.use("/api/v1/auth/user");
    this.app.use("/api/v1/user");
  }

  private setupErrorHandlers(): void {
    // Catch 404
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({ error: "Route not found" });
    });

    // General error handler
    this.app.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error("Unhandled error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    );
  }

  public start(): void {
    let currentTry = 0;

    try {
      const { PORT_NO } = this.config;

      this.server.listen(PORT_NO, () => {
        console.log(`✅ Server running on port ${PORT_NO}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1); // Exit with failure
    }
  }
}
