import { CreateDBConfigs } from "configs/database/MongoDB.Config";
import mongoose from "mongoose";

const {
  MONGO_URI,
  APP_NAME,
  DB_NAME,
  serverSelectionTimeoutMS,
  socketTimeoutMS,
} = CreateDBConfigs();

const maxRetries = 10;

// Track connection state
let isConnected = false;
let eventListenersInitialized = false;

// Remove all existing event listeners
function cleanupEventListeners() {
  mongoose.connection.removeAllListeners("connected");
  mongoose.connection.removeAllListeners("disconnected");
  mongoose.connection.removeAllListeners("reconnected");
  mongoose.connection.removeAllListeners("error");
  mongoose.connection.removeAllListeners("close");
  eventListenersInitialized = false;
}

// Setup event listeners with proper cleanup
function setupEventListeners() {
  if (eventListenersInitialized) return;

  mongoose.connection.on("connected", () => {
    if (!isConnected) {
      console.log("Connected to MongoDB");
      isConnected = true;
    }
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Mongo Atlas disconnected");
    isConnected = false;
  });

  mongoose.connection.on("reconnected", () => {
    console.info("Mongo Atlas reconnected");
    isConnected = true;
  });

  mongoose.connection.on("error", (error) => {
    console.warn("Error in Mongo Atlas connection:", error);
    isConnected = false;
  });

  mongoose.connection.on("close", () => {
    console.info("Mongo Atlas connection closed");
    isConnected = false;
  });

  eventListenersInitialized = true;
}

export const connectToMongoAtlas = async () => {
  cleanupEventListeners();
  setupEventListeners();

  let retries = 0;
  while (retries < maxRetries) {
    try {
      await mongoose.connect(MONGO_URI, {
        appName: APP_NAME,
        dbName: DB_NAME,
        serverSelectionTimeoutMS,
        socketTimeoutMS,
        // Enable retry writes for better reliability
        retryWrites: true,
        // Enable retry reads for better reliability
        retryReads: true,
        //  Enable SSL/TLS for encrypted connections
        ssl: true,

        // Use modern TLS version
        tlsAllowInvalidCertificates: false,
        // Use modern TLS version
        tlsAllowInvalidHostnames: false,
        // Set connection pool size
        maxPoolSize: 50,
        // Set minimum connection pool size
        minPoolSize: 10,
      });

      if (retries === 0) {
        console.log("Connected to MongoDB with enhanced security");
      }

      return mongoose.connection;
    } catch (error: any) {
      retries++;
      console.error("Error connecting to MongoDb Atlas", error);
      console.error(`MongoDB connection attempt ${retries} failed:`, error);

      if (retries < maxRetries) {
        console.warn(
          `Retrying connection... Attempt ${retries} of ${maxRetries}`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000 * retries));
      } else {
        console.error("Max retries reached. Could not connect to MongiAtlas.");
        throw new Error("Failed to connect to MongoDB after maximum retries");
      }
    }
  }
};
