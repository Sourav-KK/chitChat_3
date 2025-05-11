// import { connectToMongoAtlas } from "./infrastructure/DB/mongo.config";
import { Server_Config } from "configs/server/Server.Config";
import express from "express";
import { createServer } from "http";
import { serverMiddlewareConfig } from "./middleware/express";
import { Application } from "express-serve-static-core";
import { createSocketServer } from "./socket/socket.config";

const app = express();
const { PORT_NO } = Server_Config();

// const Server = async () => {
//   try {
//     serverMiddlewareConfig(app);

//     app.listen(PORT_NO, () => {
//       console.info(`Server running on PORT: ${PORT_NO}`);
//     });

//     //     await connectToMongoAtlas().then();

//     // app.use("/api/v1/auth/user");
//     // app.use("/api/v1/user");
//   } catch (error: any) {
//     console.error("Error in starting server:", error);
//   }
// };

// export { Server };

export class Server {
  private app: Application;
  private config: ReturnType<typeof Server_Config>;
  private server: ReturnType<typeof createServer>;
  private io: ReturnType<typeof createSocketServer>;

  constructor() {
    this.app = app;
    this.config = Server_Config();
    this.server = createServer(this.app);
    this.io = createSocketServer(this.server);
    this.initialize();
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

  public start(): void {
    const PORT_NO = this.config.PORT_NO;

    this.server.listen(PORT_NO, () => {
      console.log(`Server running on port ${PORT_NO}`);
    });
  }
}
