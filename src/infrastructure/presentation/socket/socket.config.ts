import { createServer } from "http";
import { ServerOptions, Server } from "socket.io";
import { corsConfig } from "../middleware/express";

export const createSocketServer = (server: ReturnType<typeof createServer>) => {
  const options: ServerOptions = {
    cors: {
      methods: ["POST", "GET", "DELETE", "PUT", "PATCH"], // HTTP methods allowed from cross-origin requests
      origin: process.env.CORS_ORIGIN || "http://localhost:4000", // which domains can access your AP
      credentials: true, // Controls cookie and authentication handling
    },
  };
  return new Server(server, options);
};
