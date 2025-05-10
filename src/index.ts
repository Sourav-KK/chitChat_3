// import { connectToMongoAtlas } from "./infrastructure/DB/mongo.config";
import express from "express";
import { Server_Config } from "./configs/server/Server.Config";
import { serverMiddlewareConfig } from "./infrastructure/presentation/middleware/express";

const app = express();
const { PORT_NO } = Server_Config();

const Server = async () => {
  try {
    serverMiddlewareConfig(app);

    app.listen(PORT_NO, () => {
      console.info(`Server running on PORT: ${PORT_NO}`);
    });

    //     await connectToMongoAtlas().then();

    // app.use("/api/v1/auth/user");
    // app.use("/api/v1/user");
  } catch (error: any) {
    console.error("Error in starting server:", error);
  }
};

Server();
